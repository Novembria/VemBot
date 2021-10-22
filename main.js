"use strict";
let { WAConnection : _WAConnection } = require("@adiwajshing/baileys");
let { MessageType } = require("@adiwajshing/baileys");
const { extendedText } = MessageType
const qrcode = require("qrcode-terminal");
const figlet = require("figlet");
const fs = require("fs");

const { color, ramlanLog } = require("./lib/color");
const { serialize } = require("./lib/myfunc");
const myfunc = require("./lib/myfunc");
const afk = require("./lib/afk");

let WAConnection = myfunc.WAConnection(_WAConnection)

let _afk = JSON.parse(fs.readFileSync('./database/afk.json'));
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
let blocked = [];

global.ramlan = new WAConnection()
ramlan.mode = 'public'
ramlan.baterai = {
    baterai: 0,
    cas: false
};
ramlan.multi = true
ramlan.nopref = false
ramlan.prefa = 'anjing'
ramlan.spam = []

require('./message/ramlan.js')
nocache('./message/ramlan.js', module => console.log(color(`'${module}' Telah berubah!`)))
require('./message/antidelete.js')
nocache('./message/antidelete.js', module => console.log(color(`'${module}' Telah berubah!`)))
require('./message/help.js')
nocache('./message/help.js', module => console.log(color(`'${module}' Telah berubah!`)))

const start = async(sesion) => {
    ramlan.logger.level = 'warn'
    ramlan.browserDescription = ['Linux', 'Desktop', '3.0']

    // MENG WE EM
    console.log(color(figlet.textSync('Baby-Botz', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ CREATED BY RAMLAN ID ]'))

    // Menunggu QR
    ramlan.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(ramlanLog('Scan QR ~~'))
    })

    // Restore Sesion
    fs.existsSync(sesion) && ramlan.loadAuthInfo(sesion)

    // Mencoba menghubungkan
    ramlan.on('connecting', () => {
		console.log(ramlanLog('Connecting...'))
	})

    // Konek
    ramlan.on('open', (json) => {
		console.log(ramlanLog('Connect, Welcome Owner'))
	})

    // Write Sesion
    await ramlan.connect({timeoutMs: 30*1000})
    fs.writeFileSync(sesion, JSON.stringify(ramlan.base64EncodedAuthInfo(), null, '\t'))

    // Ya gitulah
    ramlan.on('ws-close', () => {
        console.log(ramlanLog('Koneksi terputus, mencoba menghubungkan kembali..'))
    })

    // Ntahlah
    ramlan.on('close', async ({ reason, isReconnecting }) => {
        console.log(ramlanLog('Terputus, Alasan :' + reason + '\nMencoba mengkoneksi ulang :' + isReconnecting))
        if (!isReconnecting) {
            console.log(ramlanLog('Connect To Phone Rejected and Shutting Down.'))
        }
    })

    // Block
    ramlan.on('CB:Blocklist', json => {
        if (blocked.length > 2) return
        for (let i of json[1].blocklist) {
            blocked.push(i.replace('c.us','s.whatsapp.net'))
        }
    })

    // Reject Call
    ramlan.on('CB:Call', async json => {
        let number = json[1]['from'];
        let isOffer = json[1]["type"] == "offer";
        if (number && isOffer && json[1]["data"]) {
           var tag = ramlan.generateMessageTag();
           var NodePayload = ["action", "call", ["call", {
           "from": ramlan.user.jid,
           "to": number.split("@")[0] + "@s.whatsapp.net",
           "id": tag
        }, [["reject", {
           "call-id": json[1]['id'],
           "call-creator": number.split("@")[0] + "@s.whatsapp.net",
           "count": "0"
        }, null]]]];
        ramlan.send(`${tag}, ${JSON.stringify(NodePayload)}`)
        ramlan.sendMessage(number, `Tolong jangan telpon saya jika tidak ingin diblock!\n\n*BABY-BOTZ*`, MessageType.text);
      }
    })

    // Action Battery
    ramlan.on('CB:action,,battery', json => {
        const a = json[2][0][1].value
        const b = json[2][0][1].live
        ramlan.baterai.baterai = a
        ramlan.baterai.cas = b
    })

    // Anti delete
    ramlan.on('message-delete', async(json) => {
        require('./message/antidelete')(ramlan, json)
    })

    // DETECTOR DEMOTE / PROMOTE PARTICIPANTS
    ramlan.on('group-participants-update', async(json) => {
        if (json.action === "demote") {
            let this_mem = ''
            let thisA_mem = [];
            for (let x = 0; x < json.participants.length; x++) {
                this_mem += `• @${json.participants[x].split('@')[0]}\n`
                thisA_mem.push(json.participants[x])
            }
            ramlan.sendMessage(json.jid, `「 *DEMOTE-DETECTED* 」\n\n *Total:* ${json.participants.length}\n\n${this_mem}`, extendedText, {contextInfo: {"mentionedJid": thisA_mem}})
        } else if (json.action === "promote") {
            let this_mem = ''
            let thisA_mem = [];
            for (let x = 0; x < json.participants.length; x++) {
                this_mem += `• @${json.participants[x].split('@')[0]}\n`
                thisA_mem.push(json.participants[x])
            }
            ramlan.sendMessage(json.jid, `「 *PROMOTE-DETECTED* 」\n\n *Total:* ${json.participants.length}\n\n${this_mem}`, extendedText, {contextInfo: {"mentionedJid": thisA_mem}})
        }
    })

    // Chat
    ramlan.on('chat-update', async (qul) => {
        // Presence
        if (qul.presences){
            for (let key in qul.presences){
                if (qul.presences[key].lastKnownPresence === "composing" || qul.presences[key].lastKnownPresence === "recording"){
                    if (afk.checkAfkUser(key, _afk)) {
                        _afk.splice(afk.getAfkPosition(key, _afk), 1)
                        fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                        ramlan.sendMessage(qul.jid, `@${key.split("@")[0]} berhenti afk, dia sedang ${qul.presences[key].lastKnownPresence === "composing" ? "mengetik" : "merekam"}`, MessageType.extendedText, {contextInfo: {"mentionedJid": [key]}})
                    }
                }
            }
        }
		if (!qul.hasNewMessage) return
        qul = qul.messages.all()[0]

        // Anti oversized
        if (qul.messageStubType){
            if (qul.messageStubType == 68){
                ramlan.clearMessage(qul.key)
            }
        }
        if (!qul.message) return
		if (qul.key && qul.key.remoteJid == 'status@broadcast') return
        let msg = serialize(ramlan, qul)

        // Detect Troli
        if (msg.message && msg.isBaileys && msg.isQuotedMsg && msg.quotedMsg.type === 'orderMessage'){
            ramlan.clearMessage(msg.key)
        }

		require('./message/ramlan')(ramlan, msg, blocked, _afk, welcome, left)
	})

    // Event Group 
    ramlan.on('group-participants-update', async (anj) => {
        require("./message/group")(ramlan, anj, welcome, left)
    })
}
/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
 function nocache(module, cb = () => { }) {
    console.log(color(`Module ${module} Dipantau oleh Ramlan Ganteng`))
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

start(`./${setting.sessionName}.json`)
.catch(err => console.log(err))
