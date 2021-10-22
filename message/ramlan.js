"use strict";
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    WA_DEFAULT_EPHEMERAL
} = require("@adiwajshing/baileys");
const fs = require("fs");
const moment = require("moment-timezone");
const { exec, spawn } = require("child_process");
const qrcode = require("qrcode");
const ffmpeg = require("fluent-ffmpeg");
const request = require('request');
const fetch = require("node-fetch");
const ms = require("parse-ms");
const toMS = require("ms");
const axios = require("axios");
const speed = require("performance-now");
const yts = require("yt-search");
const translate = require("@vitalets/google-translate-api");
const { default: Axios } = require("axios");
const util = require("util");
const os = require("os");
const gis = require('g-i-s');
const weather = require('weather-js');
const amazonScraper = require('amazon-buddy');
const gplay = require('google-play-scraper');
const ip2location = require('ip-to-location');
const bing = require("bing-scraper");
const brainlyv2 = require('brainly-scraper-v2');
const canvas = require("canvacord");
const text2png = require("text2png");
const google = require('google-it');
const cheerio = require('cheerio');

// stickwm
const Exif = require('../lib/exif')
const exif = new Exif()

const { addRespons, checkRespons, deleteRespons } = require('../lib/respon');
const { color, bgcolor } = require("../lib/color");
const msgFilter = require("../lib/antispam");
const { serialize, getBuffer, getRandom, getGroupAdmins, runtime } = require("../lib/myfunc");
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const _prem = require("../lib/premium");
const _sewa = require("../lib/sewa");
const afk = require("../lib/afk");
const { addBanned, unBanned, BannedExpired, cekBannedUser } = require("../lib/banned");
const { isTicTacToe, getPosTic } = require("../lib/tictactoe");
const tictac = require("../lib/tictac");
const { yta, ytv } = require("../lib/ytdl");
const { fbdl } = require("../lib/fbdl");
const game = require("../lib/game");
const { requestPay, checkPay } = require("../lib/saweria");
const { searchkomiku, komiku } = require("../lib/komiku")
const { addBadword, delBadword, isKasar, addCountKasar, isCountKasar, delCountKasar } = require("../lib/badword");
const { getEmoji } = require("../lib/emoji");
const { getLirik } = require("../lib/lirik");

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/glimit.json'));
let mess = JSON.parse(fs.readFileSync('./message/mess.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let ban = JSON.parse(fs.readFileSync('./database/ban.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let badword = JSON.parse(fs.readFileSync('./database/badword.json'));
let grupbadword = JSON.parse(fs.readFileSync('./database/grupbadword.json'));
let senbadword = JSON.parse(fs.readFileSync('./database/senbadword.json'));
let mute = JSON.parse(fs.readFileSync('./database/mute.json'));
let changelog = JSON.parse(fs.readFileSync('./database/changelog.json'));
let responDB = JSON.parse(fs.readFileSync('./database/respon.json'));

// Hit
global.hit = {}

// Game
let tictactoe = [];
let tebakgambar = [];
let family100 = [];

// Jadi bot

if (global.conns instanceof Array) console.log()
else global.conns = []

let {
    ownerNumber,
    apikey,
    lolkey,
    botName,
    limitCount,
    gamewaktu,
    saweria
} = setting

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(ramlan, msg, blocked, _afk, welcome, left) => {
    try {
        const { menu } = require("./help");
        const { type, quotedMsg, isGroup, isQuotedMsg, mentioned, sender, from, fromMe, pushname, chats, isBaileys } = msg
        if (isBaileys) return
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''

        if (ramlan.multi){
		    var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&@&-*:√^%.+-,\/\\©^]/.test(command) ? command.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&@&-*:√^%.+-,\/\\©^]/gi) : '#'
        } else {
            if (ramlan.nopref){
                prefix = ''
            } else {
                prefix = ramlan.prefa
            }
        }

        const isCmd = command.startsWith(prefix)
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''

        const botNumber = ramlan.user.jid
        const groupMetadata = isGroup ? await ramlan.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender) || false

        const isOwner = ownerNumber.includes(sender)
        const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
        const isSewa = _sewa.checkSewaGroup(from, sewa)
	    const isBan = cekBannedUser(sender, ban)
        const isAfkOn = afk.checkAfkUser(sender, _afk)
        const isAntiLink = isGroup ? antilink.includes(from) : false
        const isAntiWame = isGroup ? antiwame.includes(from) : false
        const isWelcome = isGroup ? welcome.includes(from) : false
        const isLeft = isGroup ? left.includes(from) : false
        const isUser = pendaftar.includes(sender)
        const isBadword = isGroup ? grupbadword.includes(from) : false
        const isMuted = isGroup ? mute.includes(from) : false
        
        const gcounti = setting.gcount
        const gcount = isPremium ? gcounti.prem : gcounti.user

        const tanggal = moment().format("ll")
        const jam = moment().format("HH:mm:ss z")
        
        const isUrl = (url) => {
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        function monospace(string) {
            return '```' + string + '```'
        }   
        function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
        function randomNomor(angka){
            return Math.floor(Math.random() * angka) + 1
        }
        function clockString(ms) {
      let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
      let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
      let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
      return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
    }
     
        let settingstatus = 0;
    if (new Date() * 1 - settingstatus > 1000) {
      let _uptime = process.uptime() * 1000;
      let uptime = clockString(_uptime);

await ramlan.setStatus(`Aktif Selama: ${uptime} | Total Pengguna: 5${pendaftar.length} | Baterai: ${ramlan.baterai.baterai} %`).catch((_) => _);
      settingstatus = new Date() * 1;
    }
        const nebal = (angka) => {
            return Math.floor(angka)
        }
        const reply = (teks) => {
            return ramlan.sendMessage(from, teks, text, {quoted:msg})
        }
        const sendMess = (hehe, teks) => {
            return ramlan.sendMessage(hehe, teks, text)
        }
        const mentions = (teks, memberr, id) => {
            let ai = (id == null || id == undefined || id == false) ? ramlan.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : ramlan.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
            return ai
        }
        async function sendFileFromUrl(from, url, caption, msg, men) {
            let damta = await getBuffer(url)
            let res = await axios.head(url)
            let mime = res.headers['content-type'] ? res.headers['content-type'] : "image/gif"
            let type = mime.split("/")[0]+"Message"
            if(mime === "image/gif"){
                type = MessageType.video
                mime = Mimetype.gif
            }
            if(mime === "application/pdf"){
                type = MessageType.document
                mime = Mimetype.pdf
            }
            if(mime.split("/")[0] === "audio"){
                mime = Mimetype.mp4Audio
            }
            return ramlan.sendMessage(from, damta, type, {caption: caption, quoted: msg, mimetype: mime, contextInfo: {"mentionedJid": men ? men : []}})
        }
        
        // SPAM
        const spampm = () => {
            console.log(color('[SPAM]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))
            msgFilter.addSpam(sender, ramlan.spam)
            if (msgFilter.isSpam(sender, ramlan.spam)){
                addBanned(sender, '30m', ban)
                reply(`Kamu melakukan spam\nKamu akan diban selama 30menit`)
            } else {
            reply(`Hai\nKamu terdeteksi menggunakan command tanpa jeda\nHarap tunggu 5 detik`)
            }
        }
        const spamgr = () => {
            console.log(color('[SPAM]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
            msgFilter.addSpam(sender, ramlan.spam)
            if (msgFilter.isSpam(sender, ramlan.spam)){
                addBanned(sender, '30m', ban)
                reply(`Kamu melakukan spam\nKamu akan diban selama 30menit`)
            } else {
            reply(`Hai\nKamu terdeteksi menggunakan command tanpa jeda\nHarap tunggu 5 detik`)
            }
        }

        const isImage = (type === 'imageMessage')
        const isVideo = (type === 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isMedia = isImage || isVideo || isSticker || (type == 'audioMessage') || (type == 'documentMessage')
        const isQuotedImage = isQuotedMsg ? (quotedMsg.type === 'imageMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? (quotedMsg.type === 'videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? (quotedMsg.type === 'stickerMessage') ? true : false : false
        const isButton = (type == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedDisplayText : ''

        //  Anti spam
        msgFilter.ResetSpam(ramlan.spam)

        // TicTacToe
        if (isTicTacToe(from, tictactoe) && !isMuted) {
            tictac(ramlan, chats, prefix, tictactoe, from, sender, reply, mentions, addBalance, balance)
        }

        // Mode
        if (ramlan.mode === 'self'){
            if (!fromMe) return
        }

        // Anti link
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                ramlan.groupRemove(from, [sender])
            }
        }
        
        // Anti wame
        if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(wa.me\/)/gi)) {
                reply(`*「 NOMOR LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link nomor, maaf kamu akan di kick`)
                ramlan.groupRemove(from, [sender])
            }
        }
        
        // Badword
        if (isGroup && isBadword && !isOwner && !isGroupAdmins){
            for (let kasar of badword){
                if (chats.toLowerCase().includes(kasar)){
                    if (isCountKasar(sender, senbadword)){
                        if (!isBotGroupAdmins) return reply(`Kamu beruntung karena bot bukan admin`)
                        reply(`*「 ANTI BADWORD 」*\n\nSepertinya kamu sudah berkata kasar lebih dari 5x, maaf kamu akan di kick`)
                        ramlan.groupRemove(from, [sender])
                        delCountKasar(sender, senbadword)
                    } else {
                        addCountKasar(sender, senbadword)
                        reply(`Kamu terdeteksi berkata kasar\nJangan ulangi lagi atau kamu akan dikick`)
                    }
                }
            }
        }

        // Banned
        if (isBan) return
        BannedExpired(ban)
        
        // MUTE
        if (isMuted){
            if (!isGroupAdmins && !isOwner) return
            if (chats.toLowerCase().startsWith(prefix+'unmute')){
                let anu = mute.indexOf(from)
                mute.splice(anu, 1)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot telah diunmute di group ini`)
            }
        }

        // GAME 
        game.cekWaktuFam(ramlan, family100)
        game.cekWaktuTG(ramlan, tebakgambar)

        // GAME 
        if (game.isTebakGambar(from, tebakgambar) && isUser){
            if (chats.toLowerCase().includes(game.getJawabanTG(from, tebakgambar))){
                var htgm = randomNomor(100)
                addBalance(sender, htgm, balance)
                await reply(`*Selamat jawaban kamu benar*\n*Jawaban :* ${game.getJawabanTG(from, tebakgambar)}\n*Hadiah :* $${htgm}\n\nIngin bermain lagi? kirim *${prefix}tebakgambar*`)
                tebakgambar.splice(game.getTGPosi(from, tebakgambar), 1)
            }
        }

        // GAME
        if (game.isfam(from, family100) && isUser){
            var anjuy = game.getjawaban100(from, family100)
            for (let i of anjuy){
                if (chats.toLowerCase().includes(i)){
                    var htgmi = Math.floor(Math.random() * 20) + 1
                    addBalance(sender, htgmi, balance)
                    await reply(`*Jawaban benar*\n*Jawaban :* ${i}\n*Hadiah :* $${htgmi}\n*Jawaban yang blum tertebak :* ${anjuy.length - 1}`)
                    var anug = anjuy.indexOf(i)
                    anjuy.splice(anug, 1)
                }
            }
            if (anjuy.length < 1){
                ramlan.sendMessage(from, `Semua jawaban sudah tertebak\nKirim *${prefix}family100* untuk bermain lagi`, text)
                family100.splice(game.getfamposi(from, family100), 1)
            }
        }
        // Premium
        _prem.expiredCheck(premium)

        // Auto Regist
        if (isCmd && !isUser){
			pendaftar.push(sender)
			fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar))
        } 

        // ANTI SPAM
        if (isCmd && msgFilter.isFiltered(sender) && !isGroup) return spampm()
        if (isCmd && msgFilter.isFiltered(sender) && isGroup) return spamgr()
        if (isCmd && !isOwner && !isPremium) msgFilter.addFilter(sender)

      /*  const premiumPath = './database/premium'
        if (fs.existsSync(premiumPath + '/' + sender + '.json')) {
            if (!isGroup && !chats.startsWith(prefix) && !fromMe && global.ramlan.user.jid == ramlan.user.jid) {
                let data_sewa = JSON.parse(fs.readFileSync(premiumPath + '/' + sender + '.json'))
                if (data_sewa.session == 'name') {
                        if (chats.length < 1) return reply(`Masukkan nama dengan benar`)
                        if (chats.length > 60) return reply( `Maaf kak nama yang telah dimasukan lebih dari 60 kata :(`)
                        data_sewa.data.name = chats
                        data_sewa.session = 'month'
                        fs.writeFile(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3), () => {
                        ramlan.sendMessage(from, `Oke mau berapa bulan untuk jadi premium? 🤖

*Rp5.000,- / bulan*

_Termasuk pajak, rate 13% untuk ovo dan 11% selain ovo_

Untuk lebih jelasnya atau apabila ada kendala silahkan hubungi : @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                         })
                    } else if (data_sewa.session == 'month') {
                        if (isNaN(chats)) return reply( `Masukan hanya angka ya :)`)
                        if (Number(chats) > 12) return reply( `Maaf kak bulan tidak lebih dari 12 :(`)
                        data_sewa.data.month = Number(chats)
                        data_sewa.session = 'payment'
                        fs.writeFileSync(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                        reply( `Payment mau via apa kak? 💰😄

Tersedia : ovo, gopay, dana, linkaja, qris`)

                    } else if (data_sewa.session == 'payment') {
                        const regexSesi = new RegExp('^(ovo|gopay|dana|linkaja|qris)$', 'g')
                        if (!chats.toLowerCase().match(regexSesi)) return reply( `Payment tersebut tidak terdaftar kak, mohon masukan yang sudah ada di list.`)
                        data_sewa.data.payment = chats.toLowerCase()
                        data_sewa.session = 'phone'
                        fs.writeFileSync(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                        reply( `Mohon masukan nomer telepon untuk melanjutkan pembayaran 📲\n\n_Contoh : 08552xxxxxxx_`)
                    } else if (data_sewa.session == 'phone') {
                        if (isNaN(chats)) return reply( `Masukan hanya angka ya :)`)
                        if (chats.length > 40) return reply( `Sepertinya tidak ada nomer telepon lebih dari 40 kata hmm..`)
                        data_sewa.data.phone = chats.toLowerCase()
                        data_sewa.session = 'email'
                        fs.writeFileSync(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                        reply( `Silahkan masukan email 📭, input ini opsional anda bisa skip dengan ketik *skip* untuk menggunakan email default owner.`)
                    } else if (data_sewa.session == 'email') {
                        if (chats !== 'skip' && !chats.includes("@")) return reply(`Masukkan email dengan benar`)
                        if (chats.length > 60) return reply( `Mohon masukan email dibawah 50 kata kak!`)
                        data_sewa.data.email = chats.toLowerCase() == 'skip' ? saweria.email : chats
                        data_sewa.session = 'pay'
                        fs.writeFileSync(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                        reply(`Oke kak pesanan sewa sudah siap 😇

*Nama* : ${data_sewa.data.name}
*Nomor*: ${data_sewa.number.replace(/@.+/g, '')}
*Waktu premium (dalam bulan)* : ${data_sewa.data.month}
*Payment* : ${data_sewa.data.payment} 
*Email* : ${data_sewa.data.email == saweria.email ? '-' : data_sewa.data.email}

Apakah data tersebut benar? akan gagal apabila terdapat kesalahan input.

\`\`\`ketik Y untuk melanjutkan, N untuk mengulangi inputan dan ${prefix}premium batal untuk membatalkan pesanan\`\`\`
`)
                    } else if (data_sewa.session == 'pay') {
                        if (chats.toLowerCase() == 'y') {
                            const amountPay = data_sewa.data.month * 15000
                            data_sewa.status = true
                            data_sewa.session = 'pay'
                            fs.writeFileSync(premiumPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                            requestPay(data_sewa.data.name, data_sewa.data.phone, amountPay, data_sewa.data.email, 'PREMIUM ' + pushname, data_sewa.data.payment)
                            .then(result => {
                                sendMess(ownerNumber, `REQUEST PAY : \n${util.format(result)}`)
                                let dataID = JSON.parse(fs.readFileSync(premiumPath + '/ids-match.json'))
                                for (let i = 0;i < dataID.length;i++) {
                                    if (dataID[i]['SID'] == data_sewa['ID']) {
                                        dataID[i]['PAID'] = result.data.id
                                        dataID[i].data = data_sewa
                                        fs.writeFileSync(premiumPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                    }
                                }
                                // Interval Cek Prembayaran
                                let status = {
                                    from: ''
                                }
                                status.from = from
                                let idPay = result.data.id
                                let bayarINTV = setInterval(() => {
                                    let data_sewa = fs.existsSync(premiumPath + '/' + sender + '.json') ? JSON.parse(fs.readFileSync(premiumPath + '/' + sender + '.json')) : { status: false }
                                    checkPay(idPay)
                                    .then((rest) => {
                                        clearInterval(bayarINTV)
                                        sendMess(ownerNumber, `Sukses bayar dari ${status.from}\n${util.format(rest)}`)
                                        sendMess(status.from, `Terima kasih ${data_sewa.data.name} pembayaran telah diterima dengan ID ${result.data.id.toUpperCase()}, sesi premium anda telah diaktifkan untuk ${data_sewa.data.month} bulan ✅😇`)
                                        if (_prem.checkPremiumUser(data_sewa.number, premium)){
                                            premium[_prem.getPremiumPosition(data_sewa.number, premium)].expired += toMs(data_sewa.data.month * 30 + "d")
                                            fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                                            let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                                            dataID.splice(indexData_sewa, 1)
                                            fs.writeFileSync(premiumPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                            fs.unlinkSync(premiumPath + '/' + sender + '.json')
                                        } else {
                                            _prem.addPremiumUser(data_sewa.number, toMs(data_sewa.data.month * 30 + "d"), premium)
                                            let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                                            dataID.splice(indexData_sewa, 1)
                                            fs.writeFileSync(premiumPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                            fs.unlinkSync(premiumPath + '/' + sender + '.json')
                                        }
                                    })
                                    .catch(() => { })
                                    if (!data_sewa.status) {
                                        console.log('Payment Dibatalkan atau Direset')
                                        clearInterval(bayarINTV)
                                    }
                                }, 2000);

                                const typeBayar = result.data.payment_type
                                if (typeBayar == 'ovo') {
                                    reply( `Pesanan telah dibuat 😄

_Silahkan cek notifikasi di aplikasi ovo anda_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik ${prefix}premium batal\`\`\``)
                                } else if (typeBayar == 'qris') {
                                    qrcode.toDataURL(result.data.qr_string, { scale: 8 }, (err, Durl) => {
                                        const data = Durl.replace(/^data:image\/png;base64,/, '')
                                        const bufferDataQr = new Buffer.from(data, 'base64');
                                        ramlan.sendMessage(from, bufferDataQr, MessageType.image, {
                                            caption: `Pesanan telah dibuat 😄

_Silahkan scan qr diatas ini_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik ${prefix}premium batal\`\`\``
                                        })
                                    })
                                } else {
                                    Axios.get('https://tinyurl.com/api-create.php?url=' + result.data.redirect_url)
                                    .then(rst => {
                                        const urlPay = rst.data
                                        reply( `Pesanan telah dibuat 😄

_Silahkan klik link tautan ${urlPay} untuk membayar_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik ${prefix}premium batal\`\`\``)
                                    })
                                    .catch(() => {
                                        reply( `Pesanan telah dibuat dengan ID ${result.data.id.toUpperCase()}

_Silahkan klik link tautan ${result.data.redirect_url} untuk membayar_

*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik ${prefix}premium batal\`\`\``)
                                    })
                                }
                            })
                            .catch(e => {
                                console.log(e)
                                const iderrpay = data_sewa['ID']
                                ramlan.sendMessage(from, `Maaf kak terdapat kesalahan input dengan ID : ${iderrpay}, mohon lapor ke @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                                sendMess(ownerNumber, `ERROR ID : ${iderrpay}\n${util.format(e)}`)
                            })
                        } else if (chats.toLowerCase() == 'n') {
                            fs.unlinkSync(sewaPath + '/' + sender + '.json')
                            let objsewa = {
                                 status: false,
                                 session: 'name',
                                 name: pushname,
                                 created_at: new Date(),
                                 number: sender,
                                 data: {
                                      name: '',
                                      month: '',
                                      payment: '',
                                      phone: '',
                                      grouplink: '',
                                 }
                            }
                            fs.writeFile(sewaPath + '/' + sender + '.json', JSON.stringify(objsewa, null, 3), () => {
                                reply( `Baik kak opsi telah direset, silahkan ketik disini atas nama siapa 😊`)
                            })
                        }
                    } else {
                        reply( `Inputan belum beres kak! mohon isi data yang dibutuhkan.`)
                    }
            }
        }

        // Sewa
        _sewa.expiredCheck(global.ramlan, sewa)

        // Sewa
        const sewaPath = './database/sewa'
        if (fs.existsSync(sewaPath + '/' + sender + '.json')) {
            if (!isGroup && !chats.startsWith(prefix) && !msg.key.fromMe && global.ramlan.user.jid == ramlan.user.jid) {
                let data_sewa = JSON.parse(fs.readFileSync(sewaPath + '/' + sender + '.json'))
                if (data_sewa.session == 'name') {
                    if (chats.length < 1) return reply(`Masukkan nama dengan benar`)
                    if (chats.length > 60) return reply( `Maaf kak nama yang telah dimasukan lebih dari 60 kata :(`)
                    data_sewa.data.name = chats
                    data_sewa.session = 'month'
                    fs.writeFile(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3), () => {
                        ramlan.sendMessage(from, `Oke mau berapa bulan untuk sewa bot nya? 🤖

*Rp15.000,- / bulan*

_Termasuk pajak, rate 13% untuk ovo dan 11% selain ovo_

Untuk lebih jelasnya atau apabila ada kendala silahkan hubungi : @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                    })
                } else if (data_sewa.session == 'month') {
                    if (isNaN(chats)) return reply( `Masukan hanya angka ya :)`)
                    if (Number(chats) > 12) return reply( `Maaf kak bulan tidak lebih dari 12 :(`)
                    data_sewa.data.month = Number(chats)
                    data_sewa.session = 'payment'
                    fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                    reply( `Payment mau via apa kak? 💰😄

Tersedia : ovo, gopay, dana, linkaja, qris`)

                } else if (data_sewa.session == 'payment') {
                    const regexSesi = new RegExp('^(ovo|gopay|dana|linkaja|qris)$', 'g')
                    if (!chats.toLowerCase().match(regexSesi)) return reply( `Payment tersebut tidak terdaftar kak, mohon masukan yang sudah ada di list.`)
                    data_sewa.data.payment = chats.toLowerCase()
                    data_sewa.session = 'phone'
                    fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                    reply( `Mohon masukan nomer telepon untuk melanjutkan pembayaran 📲\n\n_Contoh : 08552xxxxxxx_`)
                } else if (data_sewa.session == 'phone') {
                    if (isNaN(chats)) return reply( `Masukan hanya angka ya :)`)
                    if (chats.length > 40) return reply( `Sepertinya tidak ada nomer telepon lebih dari 40 kata hmm..`)
                    data_sewa.data.phone = chats.toLowerCase()
                    data_sewa.session = 'grouplink'
                    fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                    reply( `Siap kak, silahkan masukan link grup yang mau bot masuki 🧑‍🤝‍🧑`)
                } else if (data_sewa.session == 'grouplink') {
                    if (!chats.match(/(https:\/\/chat.whatsapp.com)/gi)) return reply(`Harap masukkan link group dengan benar`)
                    let ceke = await ramlan.cekInviteCode(chats.replace('https://chat.whatsapp.com/', ''))
                    if (ceke.status !== 200) return reply(`Harap berikan link group yang valid`)
                    data_sewa.data.grouplink = chats
                    data_sewa.session = 'email'
                    fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                    reply( `Silahkan masukan email 📭, input ini opsional anda bisa skip dengan ketik *skip* untuk menggunakan email default owner.`)
                } else if (data_sewa.session == 'email') {
                    if (chats !== 'skip' && !chats.includes("@")) return reply(`Masukkan email dengan benar`)
                    if (chats.length > 60) return reply( `Mohon masukan email dibawah 50 kata kak!`)
                    data_sewa.data.email = chats.toLowerCase() == 'skip' ? saweria.email : chats
                    data_sewa.session = 'pay'
                    fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                    sendMess(from, `Oke kak pesanan sewa sudah siap 😇

*Nama* : ${data_sewa.data.name}
*Waktu sewa (dalam bulan)* : ${data_sewa.data.month}
*Payment* : ${data_sewa.data.payment} 
*Email* : ${data_sewa.data.email == saweria.email ? '-' : data_sewa.data.email}
*Nomer telp* : ${data_sewa.data.phone}
*Link grup* : ${data_sewa.data.grouplink}

Apakah data tersebut benar? akan gagal apabila terdapat kesalahan input.

\`\`\`ketik Y untuk melanjutkan, N untuk mengulangi inputan dan ${prefix}sewa batal untuk membatalkan pesanan\`\`\`
`)
                } else if (data_sewa.session == 'pay') {
                    if (chats.toLowerCase() == 'y') {
                        const amountPay = data_sewa.data.month * 15000
                        data_sewa.status = true
                        data_sewa.session = 'pay'
                        fs.writeFileSync(sewaPath + '/' + sender + '.json', JSON.stringify(data_sewa, null, 3))
                        requestPay(data_sewa.data.name, data_sewa.data.phone, amountPay, data_sewa.data.email, 'SEWA BOT ' + pushname, data_sewa.data.payment)
                        .then(result => {
                            sendMess(ownerNumber, `REQUEST PAY : \n${util.format(result)}`)
                            let dataID = JSON.parse(fs.readFileSync(sewaPath + '/ids-match.json'))
                            for (let i = 0;i < dataID.length;i++) {
                                if (dataID[i]['SID'] == data_sewa['ID']) {
                                    dataID[i]['PAID'] = result.data.id
                                    dataID[i].data = data_sewa
                                    fs.writeFileSync(sewaPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                }
                            }
                            // Cek Pembayaran
                            let status = {
                                    from: ''
                            }
                            status.from = from
                            let idPay = result.data.id
                            let bayarINTV = setInterval(() => {
                                let data_sewa = fs.existsSync(sewaPath + '/' + sender + '.json') ? JSON.parse(fs.readFileSync(sewaPath + '/' + sender + '.json')) : { status: false }
                                checkPay(idPay)
                                .then(async(rest) => {
                                    clearInterval(bayarINTV)
                                    sendMess(ownerNumber, `Sukses bayar dari ${status.from}\n${util.format(rest)}`)
                                    sendMess(status.from, `Terima kasih ${data_sewa.data.name} pembayaran telah diterima dengan ID ${result.data.id.toUpperCase()} ✅😇\n\nBot akan otomatis masuk ke grup yang telah dikirim, chat owner apabila terdapat kendala dengan ketik *!owner*`)
                                    let cekek = await ramlan.cekInviteCode(data_sewa.data.grouplink.replace('https://chat.whatsapp.com/', ''))
                                    ramlan.acceptInvite(data_sewa.data.grouplink.replace('https://chat.whatsapp.com/', ''))
                                        .then(async rest => {
                                            let data_sewa = JSON.parse(fs.readFileSync(sewaPath + '/' + sender + '.json'))
                                            let dataID = JSON.parse(fs.readFileSync(sewaPath + '/ids-match.json'))
                                            const metaMineFc = await ramlan.fetchGroupMetadataFromWA(rest.gid)
                                            if (_sewa.checkSewaGroup(cekek.id, sewa)){
                                                sewa[_sewa.getSewaPosition(cekek.id, sewa)].expired += toMs(data_sewa.data.month * 30 + "d")
                                                fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa))
                                                sendMess(rest.gid, `Halo, waktu sewa bot telah ditambahkan di grup ${metaMineFc.subject} untuk ${data_sewa.data.month} bulan, have a nice day 😉🎇`)
                                                let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                                                dataID.splice(indexData_sewa, 1)
                                                fs.writeFileSync(sewaPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                                fs.unlinkSync(sewaPath + '/' + sender + '.json')
                                            } else {
                                                _sewa.addSewaGroup(rest.gid, toMs(data_sewa.data.month * 30 + "d"), sewa)
                                                sendMess(rest.gid, `Halo, bot telah masuk ke grup ${metaMineFc.subject} untuk ${data_sewa.data.month} bulan, have a nice day 😉🎇`)
                                                let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                                                dataID.splice(indexData_sewa, 1)
                                                fs.writeFileSync(sewaPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                                                fs.unlinkSync(sewaPath + '/' + sender + '.json')
                                            }
                                        })
                                        .catch(e => {
                                                sendMess(ownerNumber, `Kesalahan masuk grup ${util.format(e)}`)
                                                sendMess(status.from, `Maaf kak bot tidak bisa masuk grup, kirim laporan ke wa.me/${ownerNumber.replace(/@.+/g, '')}?text=Join+Group+Failed+ID+${result.data.id}`)
                                        })
                                    })
                                .catch(() => { })
                                if (!data_sewa.status) {
                                    console.log('Payment Dibatalkan atau Direset')
                                    clearInterval(bayarINTV)
                                }
                            }, 2000);

                            const typeBayar = result.data.payment_type
                            if (typeBayar == 'ovo') {
                                reply( `Pesanan telah dibuat 😄

_Silahkan cek notifikasi di aplikasi ovo anda_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik !sewa batal\`\`\``)
                            } else if (typeBayar == 'qris') {
                                qrcode.toDataURL(result.data.qr_string, { scale: 8 }, (err, Durl) => {
                                    const data = Durl.replace(/^data:image\/png;base64,/, '')
                                    const bufferDataQr = new Buffer.from(data, 'base64');
                                    ramlan.sendMessage(from, bufferDataQr, MessageType.image, {
                                        caption: `Pesanan telah dibuat 😄

_Silahkan scan qr diatas ini_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik !sewa batal\`\`\``
                                    })
                                })
                            } else {
                                Axios.get('https://tinyurl.com/api-create.php?url=' + result.data.redirect_url)
                                .then(rst => {
                                    const urlPay = rst.data
                                    reply( `Pesanan telah dibuat 😄

_Silahkan klik link tautan ${urlPay} untuk membayar_

*ID* : ${result.data.id.toUpperCase()}
*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik !sewa batal\`\`\``)
                                })
                                .catch(() => {
                                    reply( `Pesanan telah dibuat dengan ID ${result.data.id.toUpperCase()}

_Silahkan klik link tautan ${result.data.redirect_url} untuk membayar_

*Nama* : ${result.data.donator.first_name}
*Telepon* : ${result.data.donator.phone}
*Email* : ${result.data.donator.email == saweria.email ? '-' : result.data.donator.email}
*Total* : Rp${result.data.amount_raw}
*Payment* : ${result.data.payment_type}

\`\`\`Untuk membatalkan ketik !sewa batal\`\`\``)
                                })

                            }
                        })
                        .catch(e => {
                            console.log(e)
                            const iderrpay = data_sewa['ID']
                            ramlan.sendMessage(from, `Maaf kak terdapat kesalahan input dengan ID : ${iderrpay}, mohon lapor ke @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                            sendMess(ownerNumber, `ERROR ID : ${iderrpay}\n${util.format(e)}`)
                        })
                    } else if (chats.toLowerCase() == 'n') {
                        fs.unlinkSync(sewaPath + '/' + sender + '.json')
                        let objsewa = {
                            status: false,
                            session: 'name',
                            name: pushname,
                            created_at: new Date(),
                            number: sender,
                            data: {
                                name: '',
                                month: '',
                                payment: '',
                                phone: '',
                                grouplink: '',
                            }
                        }
                        fs.writeFile(sewaPath + '/' + sender + '.json', JSON.stringify(objsewa, null, 3), () => {
                            reply( `Baik kak opsi telah direset, silahkan ketik disini atas nama siapa 😊`)
                        })
                    }
                } else {
                    reply( `Inputan belum beres kak! mohon isi data yang dibutuhkan.`)
                }
            }
        }*/

        // AFK
        if (isGroup) {
            if (mentioned.length !== 0){
                for (let ment of mentioned) {
                    if (afk.checkAfkUser(ment, _afk)) {
                        const getId = afk.getAfkId(ment, _afk)
                        const getReason = afk.getAfkReason(getId, _afk)
                        const getTime = Date.now() - afk.getAfkTime(getId, _afk)
                        const heheh = ms(getTime)
                        await mentions(`@${ment.split('@')[0]} sedang afk\n\n*Alasan :* ${getReason}\n*Sejak :* ${heheh.hours} Jam, ${heheh.minutes} Menit, ${heheh.seconds} Detik lalu`, [ment], true)
                        sendMess(ment, `Ada yang mencari anda saat anda offline\n\nNama : ${pushname}\nNomor : wa.me/${sender.split("@")[0]}\nIn Group : ${groupName}\nPesan : ${chats}`)
                    }
                 if (ment === ownerNumber){
                    reply('Apa si tag tag owner ku')
                }
                if (ment === ramlan.user.jid){
                    reply(`Ya ada apa ${pushname}, silahkan kirim ${prefix}menu`)
                }
            }
        }
            if (afk.checkAfkUser(sender, _afk)) {
                _afk.splice(afk.getAfkPosition(sender, _afk), 1)
                fs.writeFileSync('./database/afk.json', JSON.stringify(_afk))
                await mentions(`@${sender.split('@')[0]} telah kembali`, [sender], true)
            }
        }

        // Auto Read
        ramlan.chatRead(from, "read")

        // CMD
        if (isCmd && !isGroup) {
ramlan.updatePresence(from, Presence.composing)
            addBalance(sender, randomNomor(20), balance)
			console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isCmd && isGroup) {
ramlan.updatePresence(from, Presence.composing)
            addBalance(sender, randomNomor(20), balance)
			console.log(color('[CMD]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
        }

        if (isOwner){
            if (chats.startsWith("> ")){
                console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
                try {
                    let evaled = await eval(chats.slice(2))
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    reply(`${evaled}`)
                } catch (err) {
                    reply(`${err}`)
                }
            } else if (chats.startsWith("$ ")){
                console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
                exec(chats.slice(2), (err, stdout) => {
					if (err) return reply(`${err}`)
					if (stdout) reply(`${stdout}`)
				})
            }
        }

        function triggerSticker() {
            try {
                for (let x = 0; x < responDB.length; x++) {
                    if (msg.message.stickerMessage.fileSha256.toString('hex') == responDB[x].hex) {
                        return responDB[x].balasan;
                    }
                }
            } catch {
                return false;
            }
        }

        // Respon Button Message
        if (isButton === 'OPEN') {
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            ramlan.groupSettingChange(from, "announcement", false)
            .then((res) => reply('Success'))
            .catch((err) => reply('Error!'))
        } else if (isButton === 'CLOSE') {
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
            if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            ramlan.groupSettingChange(from, "announcement", true)
            .then((res) => reply('Success'))
            .catch((err) => reply('Error!'))
        } else if (isButton === 'MENU') {
            axios.get('https://api-ramlan.herokuapp.com/api/ucapan?timeZone=Asia/Jakarta') // ucapan.data.result
            .then(async(ucapan) => {
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
                reply(menu(ucapan, prefix, pendaftar, runtime(process.uptime()), pushname, isOwner, isPremium, sisalimit, limitCount, sisaGlimit, gcount, expiredPrem(), tanggal, jam, setting.emote, ramlan.mode))
                })
              } else if (isButton === 'SEWABOT') {
                let qrisnya = await getBuffer('https://i.ibb.co/ftvG4TL/719ab74eb46c.jpg')
            let teksewa = ` WhatsApp - Bot

*Sewabot NoPrem:*
1 Minggu Rp 3.000
1 Bulan Rp 5.000
Permanen 13.000
*Sewabot + Prem:*
1 Minggu Rp 5.000
1 Bulan Rp 10.000
Permanen Rp 20.000

*Note:*
Sewa/Rent : Bot Join Group
Premium : Upgrade Status User

Kirim Bukti Transfernya Kesini👇
wa.me/${ownerNumber.split("@")[0]}

_Regards : Novem_`
                ramlan.sendMessage(from, qrisnya, MessageType.image,
                {
                quoted: {
                key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) },
                message: { "imageMessage": {
                "mimetype": "image/png", 
                "caption": "*Want to rent a message to the #owner*", 
                "jpegThumbnail": fs.readFileSync(setting.pathImg)
                }
           }
     },
     caption: teksewa
     })
              } else if (isButton === 'SYARAT & KETENTUAN') {
                let qrisnya = await getBuffer('https://i.ibb.co/ftvG4TL/719ab74eb46c.jpg')
            let teksewa = `Syarat & Ketentuan *${botName}*

🇬🇧 English Languange
• Bot not receiving *calls*
• Prohibited *copy display* bot
• Do not *spam* bots
• Bots don't store your *personal data*
• If you find a bug, issue or request a feature, please contact the bot developer
• Bots have the right to *block* or *ban* someone for any reason or no reason

🇮🇩 Bahasa Indonesia
• Bot tidak menerima *Panggilan*
• Dilarang *menyalin Tampilan* Bot
• Dilarang melakukan *spam* terhadap bot
• Bot tidak menyimpan *data pribadi* anda
• Apabila menemukan bug, error, atau meminta fitur harap hubungi pengembang bot
• Bot berhak *memblokir* atau *ban* terhadap seseorang dengan alasan maupun tanpa alasan

_Regards : Novem_`
              ramlan.sendMessage(from, qrisnya, MessageType.image,
                {
                quoted: {
                key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) },
                message: { "imageMessage": {
                "mimetype": "image/png", 
                "caption": "*Don't spam BOT!*", 
                "jpegThumbnail": fs.readFileSync(setting.pathImg)
                }
           }
     },
     caption: teksewa
     })
                }
        switch(command || triggerSticker()){
            case prefix+'grup':
            case prefix+'group':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                let buttonMessage = {
                    contentText: "Please choose from the provided options",
                    footerText: setting.botName,
                    buttons: [
                      {buttonId: 'id1', buttonText: {displayText: 'OPEN'}, type: 1},
                      {buttonId: 'id2', buttonText: {displayText: 'CLOSE'}, type: 1}
                    ],
                    headerType: 1
                }
                
                ramlan.sendMessage(from, buttonMessage, MessageType.buttonsMessage)    
                break
      case 'vem':
      case prefix+'help':
      case prefix+'menu':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `〔 INFO 〕
› *Name:* ${pushname}
› *Status:* ${isOwner ? 'OWNER' : isPremium ? 'Premium' : 'Gratisan'}
› *Limit:* ${isPremium ? 'Unlimited' : `${sisalimit}/${limitCount}`}
› *Expired Prem:* ${isOwner ? 'Unlimited' : isPremium ? expired : 'Not Premium'}
〔 BOT-STATUS 〕
› *Nama:* ${setting.botName}
› *Tanggal:* ${tanggal}
› *Jam:* ${jam}
› *Baterai:* ${ramlan.baterai.baterai}%
› *Mengecas:* ${ramlan.baterai.cas === 'true' ? 'Yes' : 'No'}
› *Respon:* ${latensii.toFixed(4)} _ms_
› *Total Pengguna:* 5${pendaftar.length}
› *Aktif Selama:* ${runtime(anu)}
› *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
› *Total Chat:* 3${totalchat.length}
› *Platform:* ${os.platform()}
› *Respon Host:* ${os.cpus()[0].speed} MHz
› *Core:* ${os.cpus().length}
› *CPU:* ${os.cpus()[0].model}
› *Release:* ${os.release()}
› *V. Whatsapp:* ${wa_version}
› *Host:* ${os.hostname()}
› *Versi OS:* ${os_version}
› *Merk HP:* ${device_manufacturer}
› *Versi HP:* ${device_model}
〔 NOTE 〕
› Button do not appear?,
type ${prefix}command
› Tombol tidak muncul?, 
ketik ${prefix}command

`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg))
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'opengrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                ramlan.groupSettingChange(from, "announcement", false)
                .then((res) => reply('Success'))
                .catch((err) => reply('Error'))
                break
            case prefix+'closegrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                ramlan.groupSettingChange(from, "announcement", true)
                .then((res) => reply('Success'))
                .catch((err) => reply('Error'))
                break
            case 'user':
            case prefix+'user':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `User Yg Terdaftar 5${pendaftar.length} User`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'tebakgambar':{
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (game.isTebakGambar(from, tebakgambar)) return reply(`Masih ada soal yang belum di selesaikan`)
                let anu = await axios.get(`https://api-ramlan.herokuapp.com/api/game/tebak-gambar?apikey=${apikey}`)
                const petunjuk = anu.data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')
                sendFileFromUrl(from, anu.data.img, monospace(`Silahkan jawab soal berikut ini\n\nPetunjuk : ${petunjuk}\nWaktu : ${gamewaktu}s`), msg)
                let anih = anu.data.jawaban.toLowerCase()
                game.addgambar(from, anih, gamewaktu, tebakgambar)
                gameAdd(sender, glimit)
            }
                break
            case prefix+'command':{
            axios.get('https://api-ramlan.herokuapp.com/api/ucapan?timeZone=Asia/Jakarta') // ucapan.data.result
            .then(async(ucapan) => {
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
                reply(menu(ucapan, prefix, pendaftar, runtime(process.uptime()), pushname, isOwner, isPremium, sisalimit, limitCount, sisaGlimit, gcount, expiredPrem(), tanggal, jam, setting.emote, ramlan.mode))
                })
              }
              break
            case prefix+'fakedata':
                axios.get('https://randomuser.me/api/?results=50').then(r => {
                    let random_pict = r.data.results[Math.floor(Math.random() * r.data.results.length)];
                    let res_fakedata = `「 *FAKEDATA-GENERATOR* 」
                  
• *FirstName:* ${random_pict.name.first}
• *LastName:* ${random_pict.name.last}
• *Gender:* ${random_pict.gender}
• *Location:* ${random_pict.location.street.name}
• *StreetNumber:* ${random_pict.location.street.number}
• *City:* ${random_pict.location.city}
• *State:* ${random_pict.location.state}
• *Country:* ${random_pict.location.country}
• *Postcode:* ${random_pict.location.postcode}
• *Latitude:* ${random_pict.location.coordinates.latitude}
• *Longitude:* ${random_pict.location.coordinates.longitude}
• *TimeZone:* ( ${random_pict.location.timezone.offset} ) ${random_pict.location.timezone.description}
• *Email:* ${random_pict.email}
• *Uuid:* ${random_pict.login.uuid}
• *Username:* ${random_pict.login.username}
• *Password:* ${random_pict.login.password}
• *Salt:* ${random_pict.login.salt}
• *Md5:* ${random_pict.login.md5}
• *Sha1:* ${random_pict.login.sha1}
• *Sha256:* ${random_pict.login.sha256}
• *Phone:* ${random_pict.phone}
• *Cell:* ${random_pict.cell}`;
                    reply(mess.wait)
                    sendFileFromUrl(from, random_pict.picture.medium, res_fakedata, msg)
                  }).catch((err) => {
                    sendMess(ownerNumber, 'FakeData Error : ' + err)
                    console.log(color('[FakeData]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case 'hapus':
            case prefix+'clearall':{
                if (!isOwner) return reply(mess.OnlyOwner)
                let chiit = await ramlan.chats.all()
                for (let i of chiit){
                    ramlan.modifyChat(i.jid, 'delete', {
                        includeStarred: false
                    })
                }
                reply(`*Siap Bosku*`)
            }
                break
            case prefix+'githubsearch':
                if (!q) return reply(`Kirim format ${prefix}githubsearch *query*\nExample: ${prefix}githubsearch x-tools`)
                axios.get(`https://github.com/search?q=${q}`).then(x => {
                    const $ = cheerio.load(x.data);
                    let myAu = [];
                    $('li.repo-list-item.hx_hit-repo.d-flex.flex-justify-start.py-4.public.source').each((i, el) => {
                        const _title_ = $(el).find('div.mt-n1 > div.f4.text-normal > a').text().trim();
                        const _langcode_ = $(el).find('div.mt-n1 > div > div.d-flex.flex-wrap.text-small.color-text-secondary > div > span > span').text().trim();
                        const _starCount_ = $(el).find('div.mt-n1 > div > div.d-flex.flex-wrap.text-small.color-text-secondary > div > a').text().trim();
                        const _updated_ = $(el).find('div.mt-n1 > div > div.d-flex.flex-wrap.text-small.color-text-secondary > div > relative-time').text().trim();
                        const _desc_ = $(el).find('div.mt-n1 > p').text().trim();
                        const _url_repo_ = $(el).find('div.mt-n1 > div.f4.text-normal > a').attr('href');
                        myAu.push({
                            title: _title_,
                            langcode: _langcode_,
                            starCount: _starCount_,
                            updated: _updated_,
                            url_repo: "https://github.com/"+_url_repo_,
                            desc: _desc_
                        })
                    })
                    let resghsearch = "「 *GITHUB-SEARCH* 」\n\n"
                    for (let x = 0; x < myAu.length; x++) {
                        resghsearch += `• *Title:* ${myAu[x].title}\n• *LangCode:* ${myAu[x].langcode}\n• *StarCount:* ${myAu[x].starCount}\n• *Updated:* ${myAu[x].updated}\n• *Url_repo:* ${myAu[x].url_repo}\n• *Desc:* ${myAu[x].desc}\n\n`
                    }
                    reply(mess.wait)
                    reply(resghsearch.trim())
                }).catch((err) => {
                    sendMess(ownerNumber, 'Githubsearch Error : ' + err)
                    console.log(color('[Githubsearch]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'donate':
            case prefix+'donasi':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `Mau Donasi? Nih 
                
Ovo :
› 0895-3362-53039
Dana : 
› 0895-3362-53039
Gopay :
› 0895-3362-53039
Pulsa : 
› 0895-3362-53039
`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'rules':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `*RULES*

1. Sebelum menggunakan, harap membaca dulu Syarat dan Ketentuan bot di .snk
2. Limit tidak pernah direset, dengan kata lain kalian sendiri harus berusaha mendapatkan Balance dan gunakan Balance tersebut untuk membeli limit di .buylimit
3. Kalian bisa bertanya dan mengetahui jika terdapat kendala atau fitur baru di bot.
4. Ingin menjadi member premium? Hubungi Owner yaa ketik .buyprem
5. Jangan lupa berdonasi`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'snk':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `❉──────────────────❉
*_Syarat dan Ketentuan_*
❉──────────────────❉

Dengan menggunakan bot ini, berarti anda setuju dengan beberapa kebijakan sebagai berikut:
1. Teks, nama pengguna, dan nomor WhatsApp anda akan disimpan di dalam server selama bot aktif.
2. Data anda akan dihapus ketika bot Offline.
3. BOT tidak menyimpan gambar, video, file, audio, dan dokumen yang anda kirim.
4. BOT tidak akan pernah meminta anda untuk memberikan informasi pribadi.
5. Jika menemukan Bug/Error silahkan langsung lapor ke Owner bot.
6. BOT tidak boleh digunakan untuk layanan yang bertujuan/berkontribusi dalam: 
    • seks / perdagangan manusia
    • perjudian
    • perilaku adiktif yang merugikan 
    • kejahatan
    • kekerasan (kecuali jika diperlukan untuk melindungi keselamatan publik)
    • pembakaran hutan / penggundulan hutan
    • ujaran kebencian atau diskriminasi berdasarkan usia, jenis kelamin, identitas gender, ras, seksualitas, agama, kebangsaan.
7. Dilarang keras melakukan SPAM ke bot, dan sengaja menelpon bot. Jika terindikasi melakukan hal yang tadi disebutkan, akan mendapat BANNED PERMANEN.
8. Selalu ingat bahwa bot ini dalam proses pengembangan jadi diharapkan anda dapat memakluminya jika bot terdapat banyak kekurangan.
9. Dan selalu ingat juga yang menggunakan bot ini bukan hanya anda/grup anda jadi saya memohon agar bersabar jika terjadinya delay. Serta gunakan fitur yang tersedia dengan seperlunya.
10. Apapun yang anda perintah pada bot ini baik ketika menggunakan ataupun sesudahnya, OWNER TIDAK BERTANGGUNG JAWAB!

Terima kasih!✨`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'pantun':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/pantun?apikey=${apikey}`)
					.then(({data}) => {
					textImg(data.pantun)
					})
				}
				break
				case prefix+'bucin':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/bucin?apikey=${apikey}`)
					.then(({data}) => {
					textImg(data.bucin)
					})
				}
				break
				case prefix+'cehor': case prefix+'ceritahoror':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/cehor?apikey=${apikey}`)
					.then(({data}) => {
					let { judul, thumb, desc, story } = data
					let caption = `*${judul}*\n${desc}\n${story}`
					sendFileFromUrl(from, thumb, caption, msg)
					limitAdd(sender, limit)
					})
				}
				break
				case prefix+'fakta':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/fakta?apikey=${apikey}`)
					.then(({data}) => {
					textImg(data.fakta)
					})
				}
				break
				case prefix+'katabijak':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/katabijak?apikey=${apikey}`)
					.then(({data}) => {
					textImg(data.katabijak)
					})
				}
				break
				case prefix+'motivasi':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/motivasi?apikey=${apikey}`)
					.then(({data}) => {
					textImg(data.motivasi)
					})
				}
				break
            case prefix+'add':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (isQuotedMsg && args.length < 2) {
                    ramlan.groupAdd(from, [quotedMsg.sender])
                    .then((res) => {
                        if (res.participants[0][quotedMsg.sender.split("@")[0] + '@c.us'].code === "403"){
                            let au = res.participants[0][quotedMsg.sender.split("@")[0] + '@c.us']
                            ramlan.sendGroupInvite(from, quotedMsg.sender, au.invite_code, au.invite_code_exp, groupName, `Join bang`)
                            reply(`Mengirimkan groupInvite kepada nomor`)
                        } else {
                            reply(jsonformat(res))
                        }
                    })
                    .catch((err) => reply(jsonformat(err)))
                } else if (args.length < 3 && !isNaN(args[1])){
					ramlan.groupAdd(from, [args[1] + '@s.whatsapp.net'])
					.then((res) => {
                        if (res.participants[0][args[1] + '@c.us'].code === "403"){
                            let au = res.participants[0][args[1] + '@c.us']
                            ramlan.sendGroupInvite(from, args[1] + '@s.whatsapp.net', au.invite_code, au.invite_code_exp, groupName, `Join bang`)
                            reply(`Mengirimkan groupInvite kepada nomor`)
                        } else {
                            reply(jsonformat(res))
                        }
                    })
					.catch((err) => reply(jsonformat(err)))
				} else {
					reply()
				}
                break
            case prefix+'kick':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length > 1) return reply('Tagnya satu aja kaka')
                if (mentioned.length !== 0){
                    ramlan.groupRemove(from, mentioned)
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    ramlan.groupRemove(from, [quotedMsg.sender])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (!isNaN(args[1])) {
                    ramlan.groupRemove(from, [args[1] + '@s.whatsapp.net'])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${prefix}kick @tag atau nomor atau reply pesan orang yang ingin di kick`)
                }
                break
            case prefix+'listcmd':
                let auah = `--( *List Cmd-Sticker* )--\nTotal : ${responDB.length}\n\n`
                for (let i = 0; i < responDB.length; i++){
                    auah += `• *Key:* ${responDB[i].hex}\n• *Action:* ${responDB[x].balasan}\n\n`
                }
                reply(auah.trim())
                break
            case prefix+'delcmd':
                if (!isQuotedSticker) return reply('Reply stickernya..')
                if (!deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)) return reply('Key hex tersebut tidak ada di database')
                deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)
                reply(`Berhasil remove key hex ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}`)
                break
case prefix+'attp':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}attp* Tes`)
                let ane = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
                fs.writeFileSync('./sticker/attp.webp', ane)
                exec(`webpmux -set exif ./sticker/data.exif ./sticker/attp.webp -o ./sticker/attp.webp`, async (error) => {
                    if (error) return reply(mess.error.api)
                    ramlan.sendMessage(from, fs.readFileSync(`./sticker/attp.webp`), sticker, {quoted: msg})
                    limitAdd(sender, limit)
                    fs.unlinkSync(`./sticker/attp.webp`)	
                })
            }
                break
case prefix+'tts': case prefix+'gtts':{

                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}tts* teks\n\nContoh : ${command} Hallo`)
                let tete = await getBuffer(`https://api.lolhuman.xyz/api/gtts/id?apikey=${lolkey}&text=${q}`)
                ramlan.sendMessage(from, tete, audio, { quoted: msg, ptt: true })
                limitAdd(sender, limit)
                }
                break
case prefix+'darkjokes': case prefix+'darkjoke': case prefix+'jokes': case prefix+'dark':{
					if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
					axios.get(`https://api-ramlan.herokuapp.com/api/random/darkjoke?apikey=${apikey}`)
					.then(({data}) => {
					sendFileFromUrl(from, data.urlimage, '', msg)
					limitAdd(sender, limit)
					})
				}
				break
            case prefix+'setcmd':
                if (!isQuotedSticker) return reply('Reply stickernya..')
                if (!q) return reply(`Masukan balasannya...\nContoh: ${prefix}setreshex #help`)
                if (checkRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB) === true) return reply('Key hex tersebut sudah terdaftar di database!')
                addRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), q, sender, responDB)
                reply(`• *Key:* ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}\n• *Action:* ${q}\n\nBerhasil di set`)
                break
case prefix+'asupan':{

                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
                axios.get(`https://api-ramlan.herokuapp.com/api/random/asupan?apikey=${apikey}`)
                .then(({data}) => {
                sendFileFromUrl(from, data.url, 'Asupan neh', msg)
                .catch((err) => {
                    sendMess(ownerNumber, 'Asupan : ' + err)
                    console.log(color('[Asupan]', 'red'), err)
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
              })
            }
                break  
case prefix+'ttp':

                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)

                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Hizkia`)

                fs.writeFileSync("./sticker/" + sender + "ttp.png", text2png(q, {
                    color: 'white',
                    font: '200px futura',
                    padding: 20,
                    lineSpacing: 60,
                    textAlign: 'center',
                    strokeWidth: 15
                }))
                await ffmpeg("./sticker/" + sender + "ttp.png")
                .input("./sticker/" + sender + "ttp.png")
                .on('start', function (cmd) {
                    console.log(`Started : ${cmd}`)
                })
                .on('error', function (err) {
                    console.log(`Error : ${err}`)
                    fs.unlinkSync("./sticker/" + sender + "ttp.png")
                    reply(mess.error.api)
                })
                .on('end', function () {
                    console.log('Finish')
                    exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                        if (error) return reply(mess.error.api)
                        ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                        limitAdd(sender, limit)
                        fs.unlinkSync("./sticker/" + sender + "ttp.png")	
                        fs.unlinkSync(`./sticker/${sender}.webp`)	
                    })
                })
                .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                .toFormat('webp')
                .save(`./sticker/${sender}.webp`)
                break
            case 'bot':
            case 'p':{

                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `Ya ada yang bisa dibantu, ketik #menu untuk memunculkan command BOT!`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case 'prefix': 
            case 'cekprefix':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `PREFIX : ${prefix}menu`
        let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'exif':{
				if (!isOwner) return
				const namaPack = q.split('|')[0] ? q.split('|')[0] : q
				const authorPack = q.split('|')[1] ? q.split('|')[1] : ''
				exif.create(namaPack, authorPack)
				await reply('Done gan')
            }
				break
            case prefix+'sticker':
            case prefix+'stiker':
            case prefix+'s':
            case prefix+'stickergif':
            case prefix+'sgif':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
                    await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if ((isVideo && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					reply(mess.wait)
                        await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								let tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else {
                    reply(`Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
                }
            }
                break
case prefix+'topglobal':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPGLOBAL 」 ──*\n\n'
                let arrTop = []
                for (let i = 0; i < 10; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
            }
                break
case prefix+'toplocal':{
                if (!isGroup)return reply(mess.OnlyGrup)
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPLOCAL 」 ──*\n\n'
                let arrTop = []
                let anggroup = groupMembers.map(a => a.jid)
                for (let i = 0; i < balance.length; i ++){
                    if (arrTop.length >= 10) continue
                    if (anggroup.includes(balance[i].id)) {
                        top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                        arrTop.push(balance[i].id)
                    }
                }
                mentions(top, arrTop, true)
            }
                break
//------------------< Canvas >-------------------
            case prefix+'pixel':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan  kirim image ato reply image/sticker dengan caption${command} pixel(Nomor)\n\nContoh : ${command} 16\n\nNote: Tidak support stickergif`)
                if ((isImage || isQuotedImage) && !isNaN(args[1])){
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.pixelate(media, Number(args[1]))
                    .then(Buffer => ramlan.sendImage(from, Buffer, '', msg))
                    limitAdd(sender, limit)
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated && !isNaN(args[1])){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.pixelate(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang').then(() => fs.unlinkSync(ran))
                            limitAdd(sender, limit)
                        })
					})
                } else if (isNaN(args[1])){
                    reply(body.replace(args[1], "*"+args[1]+"*")+`\n\nHarap masukkan angka\nContoh : ${command} 16`)
                } else {
                    reply(`Penggunaan  kirim image ato reply image/sticker dengan caption${command} pixel(Nomor)\n\nContoh : ${command} 16\n\nNote: Tidak support stickergif`)
                }
            }
                break
            case prefix+'phub': case prefix+'phcomment': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (!q.split("|")) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (q.split("|").length < 3) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (mentioned.length !== 0){
                    reply(mess.wait)
                    try {
                        var pic = await ramlan.getProfilePicture(mentioned[0])
                    } catch {
                        var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                    }
                    canvas.Canvas.phub({
                        username: q.split("|")[1],
                        message: q.split("|")[2],
                        image: await getBuffer(pic)
                    }).then(Buffer => ramlan.sendImage(from, Buffer, '', msg))
                    limitAdd(sender, limit)
                } else {
                    reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                }
            }
                break
            case prefix+'ytcomment':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (!q.split("|")) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (q.split("|").length < 3) return reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                if (mentioned.length !== 0){
                    reply(mess.wait)
                    try {
                        var pic = await ramlan.getProfilePicture(mentioned[0])
                    } catch {
                        var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                    }
                    canvas.Canvas.youtube({
                        username: q.split("|")[1],
                        content: q.split("|")[2],
                        avatar: await getBuffer(pic),
                        dark: true
                    }).then(Buffer => ramlan.sendImage(from, Buffer, '', msg))
                    limitAdd(sender, limit)
                } else {
                    reply(`Penggunaan ${command} @tag|username|coment\n\nContoh : ${command} @tag|ramlan|oawkoakwowka`)
                }
            }
                break
            case prefix+'trigger':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.trigger(media)
                    .then(async buffer => {
                        canvas.write(buffer, './media/' + sender + '.gif')
                        await ffmpeg('./media/' + sender + '.gif')
                        .inputFormat('gif')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.gif')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync(`./sticker/${sender}.webp`)
                                fs.unlinkSync('./media/' + sender + '.gif')
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=30, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.trigger(ran)
                        .then(async buffer => {
                            canvas.write(buffer, './media/' + sender + '.gif')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.gif')
                            .inputFormat('gif')
                            .on('start', function (cmd) {
                                console.log(`Started : ${cmd}`)
                            })
                            .on('error', function (err) {
                                console.log(`Error : ${err}`)
                                fs.unlinkSync(media)
                                reply(mess.error.api)
                            })
                            .on('end', function () {
                                console.log('Finish')
                                exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
                                    ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                    limitAdd(sender, limit)
                                    fs.unlinkSync(`./sticker/${sender}.webp`)
                                    fs.unlinkSync('./media/' + sender + '.gif')
                                })
                            })
                            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'cs': case prefix+'circlesticker': case prefix+'stickerbulat': case prefix+'stickerbulet': case prefix+'stickercircle': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.circle(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.circle(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'circle': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.circle(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.circle(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'jail': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.jail(media, true)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.jail(ran, true)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sjail':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.jail(media, true)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.jail(ran, true)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sgreyscale':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.greyscale(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.greyscale(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'greyscale': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.greyscale(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.greyscale(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'setpp': case prefix+'setppbot':
            case prefix+'setpic': case prefix+'setpicbot':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    ramlan.updateProfilePicture(ramlan.user.jid, media)
                    .then((res) => reply(jsonformat(res)))
					.catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim gambar atau reply gambar dengan caption ${command}`)
                }
            }
                break
            case prefix+'setname':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah ${command} nama\n\nContoh : ${command} XinzBot`)
                ramlan.updateProfileName(q)
                .then((res) => reply(jsonformat(res)))
				.catch((err) => reply(jsonformat(err)))
            }
                break
            case prefix+'setbio':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah ${command} nama\n\nContoh : ${command} XinzBot`)
                ramlan.setStatus(q)
                .then((res) => reply(jsonformat(res)))
				.catch((err) => reply(jsonformat(err)))
            }
                break
                // PERCOBAAN
            case prefix+'blur': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.blur(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.blur(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sblur':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.blur(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.blur(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'invert': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.invert(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.invert(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sinvert':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.invert(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.invert(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sepia': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.sepia(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.sepia(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sticksepia':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.sepia(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.sepia(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'threshold': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.threshold(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.threshold(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'sthreshold':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.threshold(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.threshold(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'colorfy': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.colorfy(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.colorfy(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'scolorfy':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.colorfy(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.colorfy(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'shit': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.shit(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.shit(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'stickshit':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.shit(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.shit(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'wasted': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.wasted(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.wasted(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'swasted':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.wasted(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.wasted(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'wanted': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.wanted(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.wanted(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'swanted':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.wanted(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.wanted(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'affect': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.affect(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.affect(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'jokeoverhead': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.jokeOverHead(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.jokeOverHead(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'hitler': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.hitler(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.hitler(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'shitler':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.hitler(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.hitler(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'trash': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.trash(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.trash(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'strash':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.trash(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.trash(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'rip': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.rip(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.rip(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'stickrip':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.rip(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.rip(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'gay': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.rainbow(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.rainbow(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'stickgay':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.rainbow(media)
                    .then(async buffer => {
                        await canvas.write(buffer, './media/' + sender + '.png')
                        await ffmpeg('./media/' + sender + '.png')
                        .input('./media/' + sender + '.png')
                        .on('start', function (cmd) {
                            console.log(`Started : ${cmd}`)
                        })
                        .on('error', function (err) {
                            console.log(`Error : ${err}`)
                            fs.unlinkSync('./media/' + sender + '.png')
                            reply(mess.error.api)
                        })
                        .on('end', function () {
                            console.log('Finish')
                            exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                if (error) return reply(mess.error.api)
                                ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                limitAdd(sender, limit)
                                fs.unlinkSync('./media/' + sender + '.png')	
                                fs.unlinkSync(`./sticker/${sender}.webp`)	
                            })
                        })
                        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(`./sticker/${sender}.webp`)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.rainbow(ran)
                        .then(async buffer => {
                            await canvas.write(buffer, './media/' + sender + '.png')
                            fs.unlinkSync(ran)
                            await ffmpeg('./media/' + sender + '.png')
							.input('./media/' + sender + '.png')
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync('./media/' + sender + '.png')
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
									limitAdd(sender, limit)
                                    fs.unlinkSync('./media/' + sender + '.png')	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'facepalm': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.facepalm(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.facepalm(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'beautiful': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (isImage || isQuotedImage) {
                    reply(mess.wait)
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    canvas.Canvas.beautiful(media)
                    .then(async buffer => {
                        ramlan.sendImage(from, buffer, 'Nih bang')
                        limitAdd(sender, limit)
                    })
                } else if (isQuotedSticker && !quotedMsg.stickerMessage.isAnimated){
                    reply(mess.wait)
                    let encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
                    let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
                        canvas.Canvas.beautiful(ran)
                        .then(async buffer => {
                            ramlan.sendImage(from, buffer, 'Nih bang')
                            limitAdd(sender, limit)
                        })
					})
                } else {
                    reply(`Kirim gambar atau reply gambar/sticker dengan caption ${command}\nNote: Tidak support sticker bergerak`)
                }
            }
                break
            case prefix+'stickerwm': 
            case prefix+'swm': 
            case prefix+'take': 
            case prefix+'takesticker': 
            case prefix+'takestick':{
                if (!isPremium) return reply(mess.OnlyPrem)
                if (args.length < 2) return reply(`Penggunaan ${command} nama|author`)
                let packname1 = q.split('|')[0] ? q.split('|')[0] : q
                let author1 = q.split('|')[1] ? q.split('|')[1] : ''
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					exif.create(packname1, author1, `stickwm_${sender}`)
                    await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                                    if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                    fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
                                    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if ((isVideo && msg.message.videoMessage.fileLength < 10000000 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					exif.create(packname1, author1, `stickwm_${sender}`)
                    reply(mess.wait)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								let tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(mess.error.api)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return reply(mess.error.api)
									ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                                    fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
                                    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
                } else if (isQuotedSticker) {
                    let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				    let media = await ramlan.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
                    exif.create(packname1, author1, `takestick_${sender}`)
                    exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                        if (error) return reply(mess.error.api)
                        ramlan.sendMessage(from, fs.readFileSync(`./sticker/${sender}.webp`), sticker, {quoted: msg})
                        fs.unlinkSync(media)
                        fs.unlinkSync(`./sticker/takestick_${sender}.exif`)
                    })
                } else {
                    reply(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
                }
            }
                break
           case prefix+'tiktok': case prefix+'tiktoknowm': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} _link tiktok_\n\nContoh : ${command} https://vt.tiktok.com/blablabla/`)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+mess.error.Iv+`\nContoh : ${command} https://vt.tiktok.com/ZSJVPawwv/`)
                reply(mess.wait)
                axios.get(`https://api-ramlan.herokuapp.com/api/tiktok?url=${args[1]}&apikey=${apikey}`)
                .then(({data}) => {
                console.log(data)
                sendFileFromUrl(from, data.result.nowatermark, '', msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                            sendMess(ownerNumber, 'Tiktok Error : ' + err)
                            console.log(color('[Tiktok]', 'red'), err)
                            reply(mess.error.api)
                        })
                  }
     		break
            case prefix+'tiktokmp3': case prefix+'tiktokaudio': {
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} _link tiktok_\n\nContoh : ${command} https://vt.tiktok.com/ZSJVPawwv/`)
                if (!isUrl(args[1]) && !args[1].includes('tiktok.com')) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+mess.error.Iv+`\nContoh : ${command} https://vt.tiktok.com/ZSJVPawwv/`)
                reply(mess.wait)
                axios.get(`https://api-ramlan.herokuapp.com/api/tiktok?url=${args[1]}&apikey=${apikey}`)
                .then(({data}) => {
                console.log(data)
                sendFileFromUrl(from, data.result.audio, '', msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                            sendMess(ownerNumber, 'Tiktok Error : ' + err)
                            console.log(color('[Tiktok]', 'red'), err)
                            reply(mess.error.api)
                        })
                  }
     		break
            case prefix+'tomp4':
            case prefix+'toimg':
            case prefix+'tomedia':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
				if (!isQuotedSticker) return reply('Reply stiker nya')
                let encmedia = JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				let media = await ramlan.downloadAndSaveMediaMessage(encmedia)
				if (quotedMsg.stickerMessage.isAnimated === true){
                    let outGif = getRandom('.gif')
                    let outMp4 = getRandom('.mp4')
                    exec(`convert ${media} ${outGif}`, (err) => {
                        if (err) {
                            console.log(err)
                            fs.unlinkSync(media)
                            return reply(`Error bruh`)
                        }
                        exec(`ffmpeg -i ${outGif} -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p ${outMp4}`, (err) => {
                            if (err) {
                                console.log(err)
                                fs.unlinkSync(media)
                                fs.unlinkSync(outGif)
                                return reply(`Error`)
                            }
                            ramlan.sendVideo(from, fs.readFileSync(outMp4), 'Nih', msg)
                            .then(() => {
                                fs.unlinkSync(outMp4)
                                limitAdd(sender, limit)
                            })
                        })
                    })
					} else {
                    reply(mess.wait)
					let ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal :V')
						ramlan.sendMessage(from, fs.readFileSync(ran), image, {quoted: msg, caption: 'NIH'})
                        limitAdd(sender,  limit)
						fs.unlinkSync(ran)
					})
					}
                }
				break
case prefix+'ganteng':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let tejs = `Cowok paling ganteng di group ini adalah\n*@${aku.jid.split('@')[0]}*`
					mentions(tejs, [aku.jid, cintax.jid], true)
					break
            case prefix+'translate': 
            case prefix+'tr':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}translate* kodebahasa teks\n*${prefix}translate* kodebahasa <reply message>\n\nContoh : ${command} id What is your name?`)
                if (isQuotedMsg){
                    let bahasanya = args[1].toString()
                    const trans = await translate(quotedMsg.chats, {
                        to: bahasanya
                    })
                    .then((res) => reply(res.text))
                    .catch((err) => {
                        reply(`${err}`)
                    })
                    trans
                    limitAdd(sender, limit)
                } else {
                    if (args.length < 3) return reply(`Penggunaan :\n*${prefix}translate* kodebahasa teks\n*${prefix}translate* kodebahasa <reply message>`)
                    let bahasanya = args[1].toString()
                    let textnya = q.slice(args[1].length + 1, q.length)
                    const trans = await translate(textnya, {
                        to: bahasanya
                    })
                    .then((res) => reply(res.text))
                    .catch((err) => {
                        reply(`${err}`)
                    })
                    trans
                    limitAdd(sender, limit)
                }
            }
                break
case prefix+'cantik':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let gejs = `Cewek️ paling cantik di group ini adalah\n*@${cintax.jid.split('@')[0]}*`
					mentions(gejs, [aku.jid, cintax.jid], true)
					break
            case prefix+'nowa':
                var teks = body.slice(6)
                if (!teks) return reply("lah?")
                var numberPattern = /\d+/g;
                var nomer = teks.match(numberPattern)
                var random_length = teks.length - nomer[0].length;
                if (random_length == 1) {
                    var random = 10
                } else if (random_length == 2) {
                    var random = 100
                } else if (random_length == 3) {
                    var random = 1000
                } else if (random_length == 4) {
                    var random = 10000
                }
                console.log(random)
                var nomerny = `List Nomer\n`
                for (let i = 0; i < random; i++) {
                    var nu = ['1','2','3','4','5','6','7','8','9']
                    var dom1 = nu[Math.floor(Math.random() * nu.length)]
                    var dom2 = nu[Math.floor(Math.random() * nu.length)]
                    var dom3 = nu[Math.floor(Math.random() * nu.length)]
                    var dom4 = nu[Math.floor(Math.random() * nu.length)]
                    if (random_length == 1) {
                        var rndm = `${dom1}`
                        var gdaftar = []
                    } else if (random_length == 2) {
                        rndm = `${dom1}${dom2}`
                    } else if (random_length == 3) {
                        rndm = `${dom1}${dom2}${dom3}`
                    } else if (random_length == 4) {
                        rndm = `${dom1}${dom2}${dom3}${dom4}`
                    }
                    var anu = await ramlan.isOnWhatsApp(`${nomer[0]}${i}@s.whatsapp.net`);
                    var bionye = await ramlan.getStatus(`${nomer[0]}${i}@s.whatsapp.net`);
                    var anuu = anu ? anu : false;
                    try {
                        if (nomerny.includes(anu.jid.split("@")[0])) {
                            //console.log(i)
                        } else {
                            nomerny += `NO: wa.me/${anu.jid.split("@")[0]}\nBIO: ${bionye.status}\n\n`
                        }
                    } catch {
                        console.log(i)
                    }
                }
                reply(nomerny)
                console.log("Done dump")
				break
case prefix+'jadian':
					if (!isGroup)return reply(mess.OnlyGrup)
					var kamu = groupMembers
					var cinta = groupMembers
					var aku = cinta[Math.floor(Math.random() * kamu.length)]
					var cintax = kamu[Math.floor(Math.random() * cinta.length)]
					let vejs = `Ciee.. yang lagi jadian\n*@${aku.jid.split('@')[0]}* ♥️ *@${cintax.jid.split('@')[0]}*\nSemoga Langgeng Hii`
					mentions(vejs, [aku.jid, cintax.jid], true)
					break
            case prefix+'readmore':
                var more = String.fromCharCode(8206)
                var readMore = more.repeat(4001)
                const rmoreteks1 = q.split('|')[0] ? q.split('|')[0] : q
                const rmoreteks2 = q.split('|')[1] ? q.split('|')[1] : ''
                reply(`${rmoreteks1}${readMore}${rmoreteks2}`)
                break
            case prefix+'ramalpasangan':
                const namayouu = q.split('|')[0] ? q.split('|')[0] : q
                const namashee = q.split('|')[1] ? q.split('|')[1] : ''
                if (!namayouu && !namashee) return reply(`kirim perintah ${prefix}ramalpasangan namakamu|namadia`)
                axios.get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${namayouu}&nama2=${namashee}&proses=+Submit%21+`)
                    .then(({ data }) => {
                        var $ = cheerio.load(data)
                        var progress = 'https://www.primbon.com/' + $('#body > img').attr('src')
                        var isi = $('#body').text().split(namashee)[1].replace('< Hitung Kembali', '').split('\n')[0]
                        var posi = isi.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ', '')
                        var nega = isi.split('Sisi Negatif Anda: ')[1]
                        var res = {
                            result: {
                                nama1: namayouu,
                                nama2: namashee,
                                thumb: progress,
                                positif: posi,
                                negatif: nega
                            }
                        }
                        var resultramalan = `「 *HASIL-RAMALAN* 」

• Nama: ${res.result.nama1}
• Pasangan: ${res.result.nama2}
• Positif: ${res.result.positif}
• Negatif: ${res.result.negatif}
`
                        reply(mess.wait)
                        sendFileFromUrl(from, res.result.thumb, resultramalan, msg)
                    }).catch((err) => {
                        sendMess(ownerNumber, 'RamalPasangan Error : ' + err)
                        console.log(color('[RamalPasangan]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'grupsearch':
                if (!q) return reply(`Format salah!, Kirim perintah\n\n${prefix}grupsearch *query*\nContoh: ${prefix}grupsearch bot`)
                axios.get(`http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=${q}&searchby=name`).then(x => {
                    const $ = cheerio.load(x.data);
                    let myAu = [];
                    $('div.wa-chat').each((i, el) => {
                      const _title_ = $(el).find('div > div > div > a > div > div').text().split('.')[1].replace('*', '').trim();
                      const _url_ = $(el).find('div.wa-chat-body > div.wa-chat-message > a.URLMessage').text();
                      myAu.push({
                        title: _title_,
                        url: _url_
                      })
                    })
                    let my_text = `「 *GROUP-SEARCH* 」\n\n`
                    for (let xyz = 0; xyz < myAu.length; xyz++) {
                        my_text += `• *Title:* ${myAu[xyz].title}\n• *Link:* ${myAu[xyz].url}\n\n`
                    }
                    reply(mess.wait)
                    reply(my_text.trim())
                  }).catch((err) => {
                      sendMess(ownerNumber, 'GroupSearch Error : ' + err)
                      console.log(color('[GroupSearch]', 'red'), err)
                      reply(mess.error.api)
                  })
                break
            case prefix+'inspect':
                if (!q) return reply(`Kirim perintah ${prefix}inspect *link*\n\nExample: ${prefix}inspect https://chat.whatsapp.com/G0io17sFYds7OTtOWHDyYF`)
                if (!q.includes('chat.whatsapp.com')) return reply(`Link group tidak valid!`)
                try {
                    ramlan.cekInviteCode(q.split("/")[3]).then(x => {

                        let AAbb = `「 *INSPECTOR-LINK* 」
                        
• *Judul:* ${x.subject}
• *Total Member:* ${x.size}
• *DiBuat Oleh:* ${x.id.split('-')[0]}
• *Pada tanggal:* ${timeConverter(x.creation)}
• *Desc:* ${x.desc ? x.desc : 'tidak terbaca'}`
                        reply(AAbb)
                      
                      function timeConverter(UNIX_timestamp){
                        var a = new Date(UNIX_timestamp * 1000);
                        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                        return time;
                      }
                    })
                } catch (e) {
                    reply('Gagal inspect!')
                }
                break
            case prefix+'shota':
                const shota = () => new Promise((resolve, reject) => {
                    const Arr = ["shotanime", "shota anime", "anime shota"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        })
                })

                shota().then(async (data) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.link, '*RANDOM-SHOTA*', msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'shota Error : ' + err)
                    console.log(color('[shota]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'kodepost':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah ${prefix}kodepost *daerah*`)

                async function searchCodePos(keywords) {
                    return new Promise((resolve, reject) => {

                        let carikodepos = "https://carikodepos.com/"
                        let url = carikodepos + "?s=" + keywords

                        axios({
                            method: "GET",
                            url: url,
                            headers: {
                                "Accept": "application/json, text/javascript, /;",
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4209.3 Mobile Safari/537.36",
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                                "Origin": carikodepos,
                                "Referer": carikodepos
                            }
                        }).then((response) => {
                            const $ = cheerio.load(response.data)
                            let search = $("tr")

                            if (search.length > 0) {
                                let results = []

                                search.each((number, element) => {
                                    if (number !== 0) {
                                        let td = $(element).find("td")
                                        let result = {}

                                        td.each((index, html) => {
                                            let value = $(html).find("a").html()
                                            let key = index === 0 ? "province" :
                                                (index === 1 ? "city" :
                                                    (index === 2 ? "subdistrict" :
                                                        (index === 3 ? "urban" : "postalcode")))

                                            result[key] = value
                                        })

                                        results.push(result)
                                    }
                                })

                                resolve({
                                    status: 200,
                                    data: results
                                })
                            } else {
                                reject("No result could be found")
                            }
                        }).catch(reject)

                    })
                }

                searchCodePos(q).then(res => {
                    let datakodepost = `「 *KODE-POST* 」\n\n`
                    for(let x = 0; x < res.data.length; x++) {
                        datakodepost += `• Provinsi: ${res.data[x].province}\n• Kota: ${res.data[x].city}\n• Subdistrict: ${res.data[x].subdistrict}\n• Urban: ${res.data[x].urban}\n• Postalcode: ${res.data[x].postalcode}\n\n`
                    }
                    reply(mess.wait)
                    reply(datakodepost.trim())
                }).catch(err => {
                    sendMess(ownerNumber, 'kodepost Error : ' + err)
                    console.log(color('[kodepost]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'appstore':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!q) return reply(`Kirim perintah dengan\n\n${prefix}appstore *query*\nContoh: ${prefix}appstore panda`)
                const appstore = require('app-store-scraper');

                appstore.search({
                    term: q,
                    num: 2,
                    page: 3,
                    country: 'us',
                    lang: 'lang'
                }).then((res) => {
                    let dataappstore = `「 *APP-STORE* 」

• Judul: ${res[0].title}
• ID: ${res[0].id}
• AppId: ${res[0].appId}
• Url: ${res[0].url}
• PrimaryGenre: ${res[0].primaryGenre}
• PrimaryGenreId: ${res[0].primaryGenreId}
• Rating: ${res[0].contentRating}
• Size: ${bytesToSize(res[0].size)}
• RequiredOSVersion: ${res[0].requiredOsVersion}
• Released: ${res[0].released}
• Updated: ${res[0].updated}
• Version: ${res[0].version}
• isFree: ${res[0].free ? 'Ya' : 'Tidak'}
• DeveloperName: ${res[0].developer}
• Reviews: ${res[0].reviews}
• Description: ${res[0].description.trim()}`
                    reply(mess.wait)
                    sendFileFromUrl(from, res[0].icon, dataappstore, msg)
                    limitAdd(sender, limit)
                }).catch((err) => {
                    sendMess(ownerNumber, 'Appstore Error : ' + err)
                    console.log(color('[Appstore]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'ebase64':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}ebase64 *text*\nContoh: ${prefix}ebase64 helloworld`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                reply(Buffer.from(q).toString('base64'))
                break
            case prefix+'debase64':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}debase64 *encrypt base64*\nContoh: ${prefix}debase64 aGVsbG93b3JsZA==`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                reply(Buffer.from(q, 'base64').toString('ascii'))
                break
            case prefix+'ehex':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}ehex *text*\nContoh: ${prefix}ehex Hello world`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                var convertHex = require('amrhextotext')
                reply(convertHex.textToHex(q))
                break
            case prefix+'dehex':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}dehex *encrypt hex*\nContoh: ${prefix}dehex 68656c6c6f20776f726c64`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                var convertHex = require('amrhextotext')
                reply(convertHex.hexToUtf8(q))
                break            
            case prefix+'ebinary':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}ebinary *text*\nContoh: ${prefix}ebinary hello world`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                    function encodeBinary(char) {
                        return char.split("").map(str => {
                            const converted = str.charCodeAt(0).toString(2);
                            return converted.padStart(8, "0");
                        }).join(" ")
                    }
                reply(encodeBinary(q))
                break
            case prefix+'debinary':
                if (!q) return reply(`Format salah!\n\nKirim perintah: ${prefix}debinary *text*\nContoh: ${prefix}debinary 01110100 01100101 01110011`)
                if (q.length > 2048) return reply('Maximal 2.048 String!')
                    function decodebinary(char) {
                        return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("");
                    }
                reply(decodebinary(q))
                break
            case prefix+'twtdl':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!q) return reply(`Kirim perintah:\n\n${prefix}twtdl *link*`)
                if (!q.includes('twitter.com')) return reply(`Link yang kamu kirim tidak valid!`)
                const twtdl = (url) => new Promise((resolve, reject) => {
                    fetch("https://twdown.net/download.php", {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "content-type": "application/x-www-form-urlencoded",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1"
                            // "cookie": "_ga=GA1.2.1814159488.1623699519; _gid=GA1.2.539894488.1623699519; _gat=1; __gads=ID=60356e4da39a627d-22cc5e8d84c90058:T=1623699520:RT=1623699520:S=ALNI_MbgAJ4sh0qPRkD-wf4Wi_G_VNLLig"
                        },
                        "referrer": "https://twdown.net/",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `URL=${url}`,
                        "method": "POST",
                        "mode": "cors"
                    }).then((ress) => ress.text())
                        .then((text) => {
                            const $ = cheerio.load(text)
                            const __thumbimage__ = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(1) > img').attr('src');
                            const __caption__ = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(2) > p').text().trim();
                            const __urlmp4__ = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href');
                            const __twtname__ = $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(2) > h4 > strong').text().trim();
                            resolve({
                                twtname: __twtname__,
                                urlimage: __thumbimage__,
                                caption: __caption__,
                                urlmp4: __urlmp4__
                            })
                        }).catch((err) => {
                            resolve({
                                message: "emrror"
                            })
                        })
                })

                twtdl(q).then(data => {
                    reply(mess.wait)
                    sendFileFromUrl(from, data.urlimage, `「 *TWITTER-DL* 」\n\n• NameTwt: ${data.twtname}\n• Type: Video/480\n• Caption: ${data.caption}\n\n_Media sedang dikirim mohon tunggu_`, msg)
                    sendFileFromUrl(from, data.urlmp4, 'Nih kak', msg)
                }).catch(err => {
                    sendMess(ownerNumber, 'TwtDL Error : ' + err)
                    console.log(color('[TwtDL]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'bing':
                if (!q) return reply(`Kirim perintah ${prefix}bing *query*\nContoh: ${prefix}bing mark`)
                bing.search({
                    q: q,
                    enforceLanguage: true  
                }, function(err, resp) {
                    if (err) {
                        console.log(err);
                    } else {
                        let myText = "「 BING-SEARCH 」\n\n";
                        for (let x = 0; x < resp.results.length; x++) {
                            myText += `• Title: ${resp.results[x].title}\n• Url: ${resp.results[x].url}\n• Desc: ${resp.results[x].description}\n\n`
                        }
                        reply(myText.trim())
                    }
                })
                break
            case prefix+'artimimpi':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}artimimpi query*`)

                function artimimpi(katakunci) {
                    return new Promise((resolve, reject) => {
                        axios.get('https://www.primbon.com/tafsir_mimpi.php?mimpi=' + katakunci + '&submit=+Submit+')
                            .then(({ data }) => {
                                var $ = cheerio.load(data)
                                var detect = $('#body > font > i').text()
                                var isAva = /Tidak ditemukan/g.test(detect) ? false : true
                                if (isAva) {
                                    var isi = $('#body').text().split(`Hasil pencarian untuk kata kunci: ${katakunci}`)[1].replace(/\n\n\n\n\n\n\n\n\n/gi, '\n')
                                    var res = {
                                        status: true,
                                        result: isi
                                    }
                                    resolve(res)
                                } else {
                                    var res = {
                                        status: false,
                                        result: `Data tidak ditemukan! Gunakan kata kunci.`
                                    }
                                    resolve(res)
                                }
                            })
                            .catch(reject)
                    })
                }
                artimimpi(q)
                    .then((hasil) => {
                        if (hasil.result == false) return reply(`Artimimpi ${q}, tidak ditemukan`)
                        reply(hasil.result.trim())
                    }).catch((err) => {
                        sendMess(ownerNumber, 'Artimimpi Error : ' + err)
                        console.log(color('[Artimimpi]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'manga':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}manga query*`)
                try {
                    reply(mess.wait)
                    axios.get(`https://myanimelist.net/search/prefix.json?type=manga&keyword=${q}&v=1`)
                        .then(({ data }) => {
                            var resultmangasearch = `*RESULT-MANGA*

• Judul: ${data.categories[0].items[0].name}
• ID: ${data.categories[0].items[0].id}
• Link: ${data.categories[0].items[0].url}
• Type: ${data.categories[0].items[0].type}
• Published: ${data.categories[0].items[0].payload.published}
• Score: ${data.categories[0].items[0].payload.score}
• Start-Year: ${data.categories[0].items[0].payload.start_year}
• Status: ${data.categories[0].items[0].payload.status}`
                            reply(resultmangasearch.trim())
                        }).catch((e) => {
                            reply(`Manga ${q} tidak di temukan`)
                        })
                } catch (err) {
                    sendMess(ownerNumber, 'Manga Error : ' + err)
                    console.log(color('[Manga]', 'red'), err)
                    reply(mess.error.api)
                }
                break
//------------------< Sertifikat >-------------------  

                case prefix+'tololserti':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/toloserti?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'pakboyserti': case prefix+'fuckboy':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/fuckboy?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'fuckgirl': case prefix+'pakgirlserti':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/fuckgirl?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'bucinserti':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/bucinserti?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'pacarserti':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} nama1|nama2\n\nContoh : ${command} Rara Cans|Ramlan ID`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} nama1|nama2\n\nContoh : ${command} Rara Cans|Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/pacarserti?apikey=${lolkey}&name1=${q.split("|")[0]}&name2=${q.split("|")[1]}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'goodboy':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/goodboy?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'goodgirl':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/goodgirl?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'badboy':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/badboy?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
                case prefix+'badgirl':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Ramlan ID`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/badgirl?apikey=${lolkey}&name=${q}`, '', msg)
                .catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
            case prefix+'kemono':
                const kemono = () => new Promise((resolve, reject) => {
                    const Arr = ["kemononime", "kemono anime", "anime kemono"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        })
                })

                kemono().then(async(data) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.link, '*RANDOM-KEMONO*', msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Kemono Error : ' + err)
                    console.log(color('[Kemono]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'brainly':
                if (!q) return reply(`Kirim perintah: ${prefix}brainly *soal*\nExample: ${prefix}brainly apa itu dpr`)
                brainlyv2(q, 5, "id").then(res => {
                    let resultbrainlyv2 = `「 *BRAINLY-SEARCH* 」\n\n`
                    for (let x = 0; x < res.data.length; x++) {
                        resultbrainlyv2 += `• *Soal:* ${res.data[x].pertanyaan}\n• *Jawaban:* ${res.data[x].jawaban[0].text.replace('Jawaban:', '').trim()}\n\n`
                    }
                    reply(resultbrainlyv2.trim())
                }).catch(err => {
                    sendMess(ownerNumber, 'Brainly Error : ' + err)
                    console.log(color('[Brainly]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'otakulast':
                try {
                    request(`https://otakudesu.moe/ongoing-anime/`, function (err, res, html) {
                        if (!err && res.statusCode == 200) {
                            var $ = cheerio.load(html)
                            const dataArrotakuon = [];
                            $('div.detpost').each((i, el) => {
                                const judulotakuon = $(el).find('div > a > div > h2').text().trim();
                                const epsotakuon = $(el).find('div.epz').text().trim();
                                const rilisdayotaku = $(el).find('div.epztipe').text().trim();
                                const tanggalotaku = $(el).find('div.newnime').text().trim();
                                const urlotakuon = $(el).find('div.thumb > a').attr('href');
                                dataArrotakuon.push({
                                    judul: judulotakuon,
                                    episode: epsotakuon,
                                    rilis: rilisdayotaku + ' ' + tanggalotaku,
                                    link: urlotakuon
                                })
                            })
                            let resultotakuon = `「 *OTAKU-LAST* 」\n\n`
                            for (let i = 0; i < dataArrotakuon.length; i++) {
                                resultotakuon += `• Judul: ${dataArrotakuon[i].judul}\n• Episode: ${dataArrotakuon[i].episode}\n• Tanggal: ${dataArrotakuon[i].rilis}\n• Link: ${dataArrotakuon[i].link}\n\n`
                            }
                            reply(mess.wait)
                            reply(resultotakuon.trim())
                        }
                    })
                } catch (err) {
                    sendMess(ownerNumber, 'otakulast Error : ' + err)
                    console.log(color('[otakulast]', 'red'), err)
                    reply(mess.error.api)
                }
                break
case prefix+'attp':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}attp* teks`)
                let ane = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
                fs.writeFileSync('./sticker/attp.webp', ane)
                exec(`webpmux -set exif ./sticker/data.exif ./sticker/attp.webp -o ./sticker/attp.webp`, async (error) => {
                    if (error) return reply(mess.error.api)
                    ramlan.sendMessage(from, fs.readFileSync(`./sticker/attp.webp`), sticker, {quoted: msg})
                    limitAdd(sender, limit)
                    fs.unlinkSync(`./sticker/attp.webp`)	
                })
            }
                break
            case prefix+'tinyurl':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}tinyurl* link\n\nContoh : ${command} https://youtube.com`)
                if (!isUrl(args[1])) return reply(body.replace(args[1], "*"+args[1]+"*") + `\n\nMasukkan link dengan benar\nContoh : ${command} https://youtube.com`)
                axios.get(`https://tinyurl.com/api-create.php?url=${args[1]}`)
                .then((a) => reply(`Nih ${a.data}`))
                .catch(() => reply(`Error, harap masukkan link dengan benar`))
                break
            case prefix+'tomp3':{
                if (isVideo || isQuotedVideo){
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    ramlan.sendMessage(from, media, audio, {quoted: msg})
                }
            }
                break
            case prefix+'waifu':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                const waifu = () => new Promise((resolve, reject) => {
                    const Arr = ["waifunime", "waifu anime", "anime waifu"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        })
                })

                waifu().then(async(data) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.link, `*RANDOM-WAIFU*`, msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Waifu Error : ' + err)
                    console.log(color('[Waifu]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'neko':
            case prefix+'nekonime':
                const neko = () => new Promise((resolve, reject) => {
                    const Arr = ["nekonime", "neko anime", "anime neko"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        })
                })

                neko().then(async (data) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.link, '*RANDOM-NEKO*', msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'neko Error : ' + err)
                    console.log(color('[neko]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'shinobu':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
                axios.get('https://waifu.pics/api/sfw/shinobu')
                .then(({data}) => sendFileFromUrl(from, data.url, 'cintai shinobu mu', msg))
                .catch(err => {
                    sendMess(ownerNumber, 'Nekonime Error : ' + err)
                    console.log(color('[Nekonime]', 'red'), err)
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
            }
                break
            case prefix+'megumin':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                reply(mess.wait)
                axios.get('https://waifu.pics/api/sfw/megumin')
                .then(({data}) => sendFileFromUrl(from, data.url, 'cintai megumin mu', msg))
                .catch(err => {
                    sendMess(ownerNumber, 'Nekonime Error : ' + err)
                    console.log(color('[Nekonime]', 'red'), err)
                    reply(mess.error.api)
                })
                limitAdd(sender, limit)
            }
                break
            case prefix+'husbu':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                const husbu = () => new Promise((resolve, reject) => {
                    const Arr = ["husbunime", "husbu anime", "anime husbu"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        }).catch(reject)
                })

                husbu().then(async (res) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, res.link, `*RANDOM-HUSBU*`, msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Husbu Error : ' + err)
                    console.log(color('[Husbu]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'loli':
                const loli = () => new Promise((resolve, reject) => {
                    const Arr = ["lolinime", "loli anime", "anime loli"];
                    const random = Arr[Math.floor(Math.random() * (Arr.length))]
                    fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${random}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${random}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                        "headers": {
                            "accept": "application/json, text/javascript, */*, q=0.01",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "sec-gpc": "1",
                            "x-app-version": "9a236a4",
                            "x-pinterest-appstate": "active",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "https://www.pinterest.com/",
                        "referrerPolicy": "origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.json())
                        .then((json) => {
                            const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                            resolve({
                                status: 200,
                                link: generatepin.images.orig.url
                            })
                        })
                })

                loli().then(async (data) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.link, '*RANDOM-LOLI*', msg)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Loli Error : ' + err)
                    console.log(color('[Loli]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'lirik': 
            case prefix+'lyric':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan : ${command} judul lagu`)
                getLirik(q)
                .then(res => {
                    const { lirik, judul, author, thumb } = res.result
                    let tmt = `*Lirik ditemukan*\n\nJudul : ${judul}\nPenyanyi : ${author}\n\n${lirik}`
                    sendFileFromUrl(from, thumb, tmt, msg)
                    limitAdd(sender, limit)
                })
                .catch(err => {
                    sendMess(ownerNumber, `[LIRIK]:` + err)
                    console.log(color(`[LIRIK] :`, 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'nulis':
                reply(`*Pilihan*\n${prefix}nuliskiri\n${prefix}nuliskanan\n${prefix}foliokiri\n${prefix}foliokanan`)
                break
            case prefix+'nuliskiri':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskiri* teks`)
                reply(mess.wait)
                const tulisan = body.slice(11)
                const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
                spawn('convert', [
                    './media/nulis/images/buku/sebelumkiri.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '22',
                    '-interline-spacing',
                    '2',
                    '-annotate',
                    '+140+153',
                    fixHeight,
                    './media/nulis/images/buku/setelahkiri.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    ramlan.sendMessage(from, fs.readFileSync('./media/nulis/images/buku/setelahkiri.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'nuliskanan':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}nuliskanan* teks`)
                reply(mess.wait)
                const tulisan = body.slice(12)
                const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
                spawn('convert', [
                    './media/nulis/images/buku/sebelumkanan.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '2',
                    '-annotate',
                    '+128+129',
                    fixHeight,
                    './media/nulis/images/buku/setelahkanan.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    ramlan.sendMessage(from, fs.readFileSync('./media/nulis/images/buku/setelahkanan.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'newstickerline':
            case prefix+'newsline':
                request('https://store.line.me/stickershop/showcase/new/id', function (err, res, html) {
                    if (!err && res.statusCode == 200) {
                        var $ = cheerio.load(html)
                        var dataArrnewsline = [];
                        var urlnewsline = 'https://store.line.me'
                        $('li.mdCMN02Li').each((i, el) => {
                            var judulnewsline = $(el).find('a > div > p').text();
                            var linknewsline = $(el).find('a').attr('href');
                            dataArrnewsline.push({
                                Judul: judulnewsline,
                                Link: urlnewsline + linknewsline
                            })
                        })
                        var resultnewsline = `「 *NEW-STICKERLINE* 」\n\n`
                        for (let i = 0; i < dataArrnewsline.length; i++) {
                            resultnewsline += `• Judul: ${dataArrnewsline[i].Judul}\n• Link: ${dataArrnewsline[i].Link}\n\n`
                        }
                        reply(mess.wait)
                        reply(resultnewsline.trim())
                    } else {
                        sendMess(ownerNumber, 'newstickerline Error : ' + err)
                        console.log(color('[newstickerline]', 'red'), err)
                        reply(mess.error.api)
                    }
                })
                break
case prefix+'harta': case prefix+'hartatahta': case prefix+'tahta':{

                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Rara`)
                reply('[❗] Hirti Tihti Tai Anjg :v')
                ramlan.sendImage(from, await getBuffer(`https://api-ramlan.herokuapp.com/api/other/tahta?q=${args[1]}&apikey=${apikey}`), '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                break
//------------------< Text Marker >-------------------
            case prefix+'harta': case prefix+'hartatahta': case prefix+'tahta':{
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Rara`)
                reply(mess.wait)
                ramlan.sendImage(from, await getBuffer(`https://api.lolhuman.xyz/api/hartatahta?apikey=${lolkey}&text=${q}`), '', msg).catch(() => reply(mess.error.api))
                }
                break
                    // Textprome
                case prefix+'blackpink':
                case prefix+'neon':
                case prefix+'greenneon':
                case prefix+'advanceglow':
                case prefix+'futureneon':
                case prefix+'sandwriting':
                case prefix+'sandsummer':
                case prefix+'sandengraved':
                case prefix+'metaldark':
                case prefix+'neonlight':
                case prefix+'holographic':
                case prefix+'text1917':
                case prefix+'minion':
                case prefix+'deluxesilver':
                case prefix+'newyearcard':
                case prefix+'bloodfrosted':
                case prefix+'halloween':
                case prefix+'jokerlogo':
                case prefix+'fireworksparkle':
                case prefix+'natureleaves':
                case prefix+'bokeh':
                case prefix+'toxic':
                case prefix+'strawberry':
                case prefix+'box3d':
                case prefix+'roadwarning':
                case prefix+'breakwall':
                case prefix+'icecold':
                case prefix+'luxury':
                case prefix+'cloud':
                case prefix+'summersand':
                case prefix+'horrorblood':
                case prefix+'thunder':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Rara`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome/${command.slice(1)}?apikey=${lolkey}&text=${q}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
                case prefix+'pornhub':
                case prefix+'glitch':
                case prefix+'avenger':
                case prefix+'space':
                case prefix+'ninjalogo':
                case prefix+'marvelstudio':
                case prefix+'lionlogo':
                case prefix+'wolflogo':
                case prefix+'steel3d':
                case prefix+'wallgravity':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/textprome2/${command.slice(1)}?apikey=${lolkey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
                    // Photo Oxy //
                case prefix+'shadow':
                case prefix+'cup':
                case prefix+'cup1':
                case prefix+'romance':
                case prefix+'smoke':
                case prefix+'burnpaper':
                case prefix+'lovemessage':
                case prefix+'undergrass':
                case prefix+'love':
                case prefix+'coffe':
                case prefix+'woodheart':
                case prefix+'woodenboard':
                case prefix+'summer3d':
                case prefix+'wolfmetal':
                case prefix+'nature3d':
                case prefix+'underwater':
                case prefix+'golderrose':
                case prefix+'summernature':
                case prefix+'letterleaves':
                case prefix+'glowingneon':
                case prefix+'fallleaves':
                case prefix+'flamming':
                case prefix+'harrypotter':
                case prefix+'carvedwood':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text\n\nContoh : ${command} Rara`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/photooxy1/${command.slice(1)}?apikey=${lolkey}&text=${q}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
                case prefix+'arcade8bit':
                case prefix+'battlefield4':
                case prefix+'pubg':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} Ramlan|Rara`)
                reply(mess.wait)
                sendFileFromUrl(from, `https://api.lolhuman.xyz/api/photooxy2/${command.slice(1)}?apikey=${lolkey}&text1=${q.split("|")[0]}&text2=${q.split("|")[1]}`, '', msg).catch(() => reply(mess.error.api))
                limitAdd(sender, limit)
                }
                    break
            case prefix+'konachan':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}konachan query*`)

                const konachanSearch = (query) => new Promise((resolve, reject) => {
                    fetch(`https://konachan.net/post?tags=${query}`, {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Upgrade-Insecure-Requests": "1",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://konachan.net/",
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.text())
                        .then((text) => {
                            const $ = cheerio.load(text)
                            const dataArr = [];
                            $('li.creator-id-181250').each((i, el) => {
                                const allgraburl = $(el).find('div.inner > a').attr('href');
                                dataArr.push(`https://konachan.net${allgraburl}`)
                            })
                            const randomPict = dataArr[Math.floor(Math.random() * dataArr.length)];
                            axios.get(randomPict).then(data => {
                                const $$ = cheerio.load(data.data)
                                const id = $$('#stats > ul:nth-child(2) > li:nth-child(2)').text().replace('Id: ', '').trim();
                                const postAt = $$('#stats > ul:nth-child(2) > li:nth-child(3) > a:nth-child(1)').text().trim();
                                const size = $$('#stats > ul:nth-child(2) > li:nth-child(4)').text().replace('Size: ', '').trim();
                                const rating = $$('#stats > ul:nth-child(2) > li:nth-child(6)').text().replace('Rating: ', '').trim();
                                const score = $$('#stats > ul:nth-child(2) > li:nth-child(7)').text().replace('Score: ', '').trim();
                                const source = $$('#stats > ul:nth-child(2) > li:nth-child(5) > a:nth-child(1)').attr('href');
                                const image = $$('#image').attr('src');
                                resolve({
                                    status: 200,
                                    id: id,
                                    postAt: postAt,
                                    size: size,
                                    rating: rating,
                                    score: score,
                                    source: source,
                                    image: image
                                })
                            })
                        })
                })

                konachanSearch(q).then(async(data)=> {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, data.image, `「 *KONACHAN-SEARCH* 」\n\n• ID: ${data.id}\n• PostAt: ${data.postAt}\n• SizeImage: ${data.size}\n• Source: ${data.source}\n• Rating: ${data.rating}\n• Score: ${data.score}`, msg)
                }).catch(async(err) => {
                    sendMess(ownerNumber, 'KONACHAN Error : ' + err)
                    console.log(color('[KONACHAN]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'growstock':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}growstock query*`)
                const growstockSearch = (query) => new Promise((resolve, reject) => {
                    fetch(`https://growstocks.xyz/search?item=${query}`, {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Upgrade-Insecure-Requests": "1",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://growstocks.xyz/",
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.text())
                        .then((text) => {
                            const $ = cheerio.load(text)
                            const dataArr = [];
                            $('div.searchRes').each((i, el) => {
                                const title = $(el).find('div > div > h2 > a').text().trim();
                                const price = $(el).find('div > div > p:nth-child(3) > b:nth-child(1)').text().trim();
                                const editedAt = $(el).find('div > div > p:nth-child(5) > b:nth-child(1)').text().trim();
                                dataArr.push({
                                    title: title,
                                    price: price ? price : 'Data tidak terbaca',
                                    editedAt: editedAt ? editedAt : 'Data tidak terbaca',
                                })
                            })
                            resolve(dataArr)
                        })
                })

                growstockSearch(q).then(data => {
                    let txt_ = `「 *GROWSTOCK-SEARCH* 」\n\n`
                    for (let x = 0; x < data.length; x++) {
                        txt_ += `• Judul: ${data[x].title}\n• Price: ${data[x].price}\n• editedAt: ${data[x].editedAt}\n\n`
                    }
                    reply(mess.wait)
                    reply(txt_.trim())
                }).catch((err) => {
                    sendMess(ownerNumber, 'growstock Error : ' + err)
                    console.log(color('[growstock]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'happymod':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}happymod query*`)
                request(`https://www.happymod.com/search.html?q=${q}`, function (err, res, html) {
                    if (!err && res.statusCode == 200) {
                        var $ = cheerio.load(html)
                        var dataArrhappymod = [];
                        $('div.pdt-app-msg').each((i, el) => {
                            var titlehappymod = $(el).find('h3 > a').text();
                            var linkhappymod = $(el).find('h3 > a').attr('href');
                            var ratehappymod = $(el).find('div.clearfix > span').text();
                            dataArrhappymod.push({
                                judul: titlehappymod,
                                link: 'https://www.happymod.com' + linkhappymod,
                                rate: ratehappymod
                            })
                        })
                        var resulthappymodsearch = `「 *HAPPY-MOD* 」\n\n`
                        for (let i = 0; i < dataArrhappymod.length; i++) {
                            resulthappymodsearch += `• Judul: ${dataArrhappymod[i].judul}\n• Link: ${dataArrhappymod[i].link}\n• Rating: ${dataArrhappymod[i].rate}\n\n`
                        }
                        reply(mess.wait)
                        reply(resulthappymodsearch.trim())
                    } else {
                        sendMess(ownerNumber, 'happymod Error : ' + err)
                        console.log(color('[happymod]', 'red'), err)
                        reply(mess.error.api)
                    }
                })
                break
            case prefix+'drakor':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}drakor query*`)
                const drakorSearch = (query) => new Promise((resolve, reject) => {
                    fetch(`https://drakorindo.life/?s=${query}`, {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Upgrade-Insecure-Requests": "1",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://drakorindo.life/",
                        "method": "GET",
                        "mode": "cors"
                    }).then((res) => res.text())
                        .then((text) => {
                            const $ = cheerio.load(text)
                            const dataArr = [];
                            $('article.mh-loop-item').each((i, el) => {
                                const title = $(el).find('div > header > h3 > a').text().trim();
                                const updateAt = $(el).find('div > header > div > span:nth-child(1)').text().trim();
                                const commentCOunt = $(el).find('div > header > div > span:nth-child(3) > a').text().trim();
                                const image = $(el).find('figure > a > img').attr('src');
                                const url = $(el).find('div > header > h3 > a').attr('href')
                                const description = $(el).find('div > div > div > p:nth-child(1)').text().trim();
                                dataArr.push({
                                    title: title,
                                    updateAt: updateAt,
                                    commentCOunt: commentCOunt,
                                    image: image,
                                    source: url,
                                    description: description
                                })
                            })
                            resolve(dataArr)
                        })
                })

                drakorSearch(q).then(async(data) => {
                    let txt_ = `「 *DRAKOR-INDO* 」\n\n`
                    for (let x = 0; x < data.length; x++) {
                        txt_ += `• Judul: ${data[x].title}\n• updateAt: ${data[x].updateAt}\n• CommentCount: ${data[x].commentCOunt}\n• url: ${data[x].source}\n• Desc: ${data[x].description}\n\n`
                    }
                    await reply(mess.wait)
                    await reply(txt_.trim())
                }).catch(async(err) => {
                    sendMess(ownerNumber, 'drakor Error : ' + err)
                    console.log(color('[drakor]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'amazon':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}amazon query*`)
                const randomnumbera = Math.floor(Math.random() * 50) + 1;

                amazonScraper.products({ keyword: q, number: randomnumbera }).then((res) => {
                    var reusltamazon = `「 *AMAZON-PRODUCT* 」

• Item: ${res.result[0].title}
• Review: ${res.result[0].reviews.total_reviews}
• Rating: ${res.result[0].reviews.rating}
• Price: ${res.result[0].price.current_price} ${res.result[0].price.currency}
• Score: ${res.result[0].score}
• Discounted: ${res.result[0].price.discounted ? 'Yes' : 'No'}
• Url: ${res.result[0].url}
• Sponsored: ${res.result[0].sponsored ? 'Yes' : 'No'}
• BestSeller: ${res.result[0].bestSeller ? 'Yes' : 'No'}
• AmazonPrime: ${res.result[0].amazonPrime ? 'Yes' : 'No'}`
                    reply(mess.wait)
                    sendFileFromUrl(from, res.result[0].thumbnail, reusltamazon.trim(), msg)
                }).catch((err) => {
                    sendMess(ownerNumber, 'amazon Error : ' + err)
                    console.log(color('[amazon]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'dork':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}dork query*`)
                google({ 'query': q, 'disableConsole': true })
                    .then((res) => {
                        var resultdork = `「 *DORK-RESULT* 」\n\n`
                        for (let i = 0; i < res.length; i++) {
                            resultdork += `${i + 1}. ${res[i].link ? res[i].link : 'data tidak ada'}\n`
                        }
                        reply(mess.wait)
                        reply(resultdork.trim())
                    }).catch((err) => {
                        sendMess(ownerNumber, 'dork Error : ' + err)
                        console.log(color('[dork]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'nomorhoki':
                if (args.length === 1) return reply(`Kirim perintah ${prefix}nomorhoki *nomor*`)
                const nomorhoki = (no) => new Promise((resolve, reject) => {
                    fetch("https://www.primbon.com/no_hoki_bagua_shuzi.php", {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "max-age=0",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "sec-gpc": "1",
                            "upgrade-insecure-requests": "1"
                        },
                        "referrer": "https://www.primbon.com/no_hoki_bagua_shuzi.htm",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `nomer=${no}&submit=+Submit%21+`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "omit"
                    }).then((res) => res.text())
                        .then((text) => {
                            const $ = cheerio.load(text)
                            $('#body').each((i, el) => {
                                const energipositif = $(el).find('table:nth-child(9) > tbody > tr:nth-child(1) > td:nth-child(1)').text().replace('ENERGI POSITIF', '');
                                const energinegatif = $(el).find('table:nth-child(9) > tbody > tr:nth-child(1) > td:nth-child(3)').text().replace('ENERGI NEGATIF', '');
                                const ratenomer = $(el).find('b:nth-child(6)').text().replace('% Angka Bagua Shuzi : ', '')
                                resolve({
                                    status: 200,
                                    energipositif: energipositif,
                                    energinegatif: energinegatif,
                                    rate: ratenomer
                                })
                            })
                        })
                })

                nomorhoki(q).then(async(data) => {
                    reply(`「 *NOMOR-HOKI* 」\n\n• No: ${q}\n• Rate: ${data.rate}\n• Positif: ${data.energipositif}\n• Negatif: ${data.energinegatif}`)
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Nomorhoki Error : ' + err)
                    console.log(color('[Nomorhoki]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'artinama':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}artinama query*`)
                axios.get(`https://www.primbon.com/arti_nama.php?nama1=${q}&proses=+Submit%21+`)
                    .then(({ data }) => {
                        var $ = cheerio.load(data)
                        var result = $('#body').text().split('Nama:')[0]
                        reply(result.trim())
                    }).catch((err) => {
                        sendMess(ownerNumber, 'artinama Error : ' + err)
                        console.log(color('[artinama]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'googleimage':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}googleimage query*`)
                async function ImageSearch(query) {
                    return new Promise((resolve, reject) => {
                        gis(query, logResults)
                        function logResults(error, results) {
                            if (error) {
                                reject(error)
                            }
                            else {
                                let url = []
                                for (let i = 0; i < results.length; i++) {
                                    url.push(decodeURIComponent(JSON.parse(`"${results[i].url}"`)))
                                }
                                resolve(url)
                            }
                        }
                    })
                }


                ImageSearch(q)
                    .then(async(hasil) => {
                        var mathlolires = Math.floor(Math.random() * 50) + 1;
                        await reply(mess.wait)
                        await sendFileFromUrl(from, hasil[mathlolires], `Hasil: ${q}`, msg)
                    }).catch(async(err) => {
                        sendMess(ownerNumber, 'GoogleImage Error : ' + err)
                        console.log(color('[GoogleImage]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'cuaca':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}cuaca daerah*`)

                weather.find({ search: q, degreeType: 'F' }, function (err, res) {
                    if (err) {
                        sendMess(ownerNumber, 'cuaca Error : ' + err)
                        console.log(color('[cuaca]', 'red'), err)
                        reply(mess.error.api)
                    } else {
                        var resultcuaca = `「 *WEATHER* 」
  
• Daerah: ${res[0].location.name}
• Latitude: ${res[0].location.lat}
• Longitude: ${res[0].location.long}
• TimeZone: ${res[0].location.timezone}
• Temperature: ${res[0].current.temperature}°
• Tanggal: ${res[0].current.date}
• Waktu: ${res[0].current.observationtime}
• Hari: ${res[0].current.day}
• Cuaca: ${res[0].current.skytext}`
                        reply(mess.wait)
                        reply(resultcuaca.trim())
                    }
                })
                break
            case prefix+'ipgeolocation':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}ipgeolocation ip*`)
                ip2location.fetch(q)
                    .then(res => {
                        var resultipgeo = `「 *IP-GEOLOCATION* 」

• IpAddress: ${q}
• Code Negara: ${res.country_code}
• Negara: ${res.country_name}
• Region Code: ${res.region_code}
• Region Name: ${res.region_name}
• City: ${res.city}
• Isp: ${res.isp}
• Zip Code: ${res.zip_code}
• TimeZone: ${res.time_zone}
• Latitude: ${res.latitude}
• Longitude: ${res.longitude}
`
                        reply(mess.wait)
                        reply(resultipgeo)
                    }).catch((err) => {
                        sendMess(ownerNumber, 'IpGeolocation Error : ' + err)
                        console.log(color('[IpGeolocation]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'heroml':
                if (args.length === 1) return reply(`Kirim perintah *${prefix}heroml query*`)
                function herodetails(name) {
                    return new Promise((resolve, reject) => {
                        var splitStr = name.toLowerCase().split(' ');
                        for (let i = 0; i < splitStr.length; i++) {
                            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                        }
                        var que = splitStr.join(' ')
                        axios.get('https://mobile-legends.fandom.com/wiki/' + que)
                            .then(({ data }) => {
                                var $ = cheerio.load(data)
                                var mw = []
                                var attrib = []
                                var skill = []
                                var name = $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > table > tbody > tr > td > font > b').text()
                                $('.mw-headline').get().map((res) => {
                                    var mwna = $(res).text()
                                    mw.push(mwna)
                                })
                                $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td').get().map((rest) => {
                                    var haz = $(rest).text().replace(/\n/g, '')
                                    attrib.push(haz)
                                })
                                $('#mw-content-text > div > div > div > div > div > div > table > tbody > tr > td > div.progressbar-small.progressbar > div').get().map((rest) => {
                                    skill.push($(rest).attr('style').replace('width:', ''))
                                })
                                axios.get('https://mobile-legends.fandom.com/wiki/' + que + '/Story')
                                    .then(({ data }) => {
                                        var $ = cheerio.load(data)
                                        var pre = []
                                        $('#mw-content-text > div > p').get().map((rest) => {
                                            pre.push($(rest).text())
                                        })
                                        var story = pre.slice(3).join('\n')
                                        var items = []
                                        var character = []
                                        $('#mw-content-text > div > aside > section > div').get().map((rest) => {
                                            character.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g, '').replace(/\n/g, ''))
                                        })
                                        $('#mw-content-text > div > aside > div').get().map((rest) => {
                                            items.push($(rest).text().replace(/\n\t\n\t\t/g, '').replace(/\n\t\n\t/g, '').replace(/\n/g, ''))
                                        })
                                        var img = $('#mw-content-text > div > aside > figure > a').attr('href')
                                        var chara = character.slice(0, 2)
                                        var result = {
                                            status: 200,
                                            hero_name: name + ` ( ${mw[0].replace('CV:', ' CV:')} )`,
                                            entrance_quotes: attrib[2].replace('Entrance Quotes', '').replace('\n', ''),
                                            hero_feature: attrib[attrib.length - 1].replace('Hero Feature', ''),
                                            image: img,
                                            items: items,
                                            character: {
                                                chara
                                            },
                                            attributes: {
                                                movement_speed: attrib[12].replace('● Movement Speed', ''),
                                                physical_attack: attrib[13].replace('● Physical Attack', ''),
                                                magic_power: attrib[14].replace('● Magic Power', ''),
                                                attack_speed: attrib[15].replace('● Attack Speed', ''),
                                                physical_defense: attrib[16].replace('● Physical Defense', ''),
                                                magic_defense: attrib[17].replace('● Magic Defense', ''),
                                                basic_atk_crit_rate: attrib[18].replace('● Basic ATK Crit Rate', ''),
                                                hp: attrib[19].replace('● HP', ''),
                                                mana: attrib[20].replace('● Mana', ''),
                                                ability_crit_rate: attrib[21].replace('● Ability Crit Rate', ''),
                                                hp_regen: attrib[22].replace('● HP Regen', ''),
                                                mana_regen: attrib[23].replace('● Mana Regen', '')
                                            },
                                            price: {
                                                battle_point: mw[1].split('|')[0].replace(/ /g, ''),
                                                diamond: mw[1].split('|')[1].replace(/ /g, ''),
                                                hero_fragment: mw[1].split('|')[2] ? mw[1].split('|')[2].replace(/ /g, '') : 'none'
                                            },
                                            role: mw[2],
                                            skill: {
                                                durability: skill[0],
                                                offense: skill[1],
                                                skill_effects: skill[2],
                                                difficulty: skill[3]
                                            },
                                            speciality: mw[3],
                                            laning_recommendation: mw[4],
                                            release_date: mw[5],
                                            background_story: story
                                        }
                                        resolve(result)
                                    }).catch((e) => reject({ status: 404, message: e.message }))
                            }).catch((e) => reject({ status: 404, message: e.message }))
                    })
                }

                herodetails(q)
                    .then(async(hasil) => {
                        var resultheroml = `「 *RESULT-FOUND!* 」

• Nama Hero: ${hasil.hero_name}
• Quotes: ${hasil.entrance_quotes}
• Hero Feature: ${hasil.hero_feature}
• Price Point: ${hasil.price.battle_point.trim()}
• Price Diamond: ${hasil.price.diamond}
• Role: ${hasil.role}
• Movement speed: ${hasil.attributes.movement_speed}
• Physical Attack: ${hasil.attributes.physical_attack}
• Attack Speed: ${hasil.attributes.attack_speed}
• Hp: ${hasil.attributes.hp} / ${hasil.attributes.hp_regen} _Regen_
• Mana: ${hasil.attributes.mana} / ${hasil.attributes.mana_regen} _Regen_
• Recommend Lane: ${hasil.laning_recommendation}
• Release: ${hasil.release_date}
• Background History: ${hasil.background_story.trim()}`

                        await reply(mess.wait)
                        await sendFileFromUrl(from, hasil.image, resultheroml.trim(), msg)
                    }).catch(async (err) => {
                        sendMess(ownerNumber, 'Heroml Error : ' + err)
                        console.log(color('[Heroml]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'wattpad':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}wattpad query*`)

                async function wattpadSearch(query) {
                    return new Promise((resolve, reject) => {
                        axios.get('https://www.wattpad.com/search/' + query)
                            .then(({ data }) => {
                                var $ = cheerio.load(data)
                                var title = []
                                var url = []
                                var id = []
                                var img = []
                                $('#results-stories > div > ul > li > div > a > div.cover.cover-xs.pull-left > img').get().map((rest) => {
                                    title.push($(rest).attr('alt'))
                                    img.push($(rest).attr('src'))
                                })
                                $('#results-stories > div > ul > li > div > a').get().map((rest) => {
                                    url.push('https://www.wattpad.com' + $(rest).attr('href'))
                                    id.push($(rest).attr('data-id'))
                                })
                                var results = []
                                for (let i = 0; i < title.length; i++) {
                                    var ress = {
                                        id: id[i],
                                        title: title[i],
                                        thumb: img[i],
                                        url: url[i],

                                    }
                                    results.push(ress)
                                }
                                resolve(results)
                            }).catch(reject)
                    })
                }

                wattpadSearch(q)
                    .then((hasil) => {
                        var resultwp = '「 *WATTPAD-SEARCH* 」\n\n'
                        for (let i = 0; i < hasil.length; i++) {
                            resultwp += `• ID: ${hasil[i].id}\n• Judul: ${hasil[i].title}\n• Url: ${hasil[i].url}\n\n`
                        }
                        reply(mess.wait)
                        reply(resultwp.trim())
                    }).catch((err) => {
                        sendMess(ownerNumber, 'wattpad Error : ' + err)
                        console.log(color('[wattpad]', 'red'), err)
                        reply(mess.error.api)
                    })
                break
            case prefix+'cekspek':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}cekspek query*`)
                try {
                    request(`https://www.gsmarena.com/res.php3?sSearch=${q}`, (error, res, html) => {
                        if (!error && res.statusCode == 200) {
                            var $ = cheerio.load(html);
                            $('#review-body > div > ul > li:nth-child(1) > a').each((i, el) => {
                                var urlnyaa = $(el).attr('href');
                                var urlimage = $('#review-body > div > ul > li:nth-child(1) > a > img').attr('src');
                                request(`https://www.gsmarena.com/${urlnyaa}`, (e, res, html) => {
                                    if (!e && res.statusCode == 200) {
                                        var $ = cheerio.load(html);

                                        $('#body > div > div.review-header > div > div.article-info-line.page-specs.light.border-bottom > h1').each((i, el) => {
                                            var judulitem = $(el).text();
                                            var displaytipe = $('#specs-list > table:nth-child(5) > tbody > tr:nth-child(1) > td.nfo').text();
                                            var displaySize = $('#specs-list > table:nth-child(5) > tbody > tr:nth-child(2) > td.nfo').text();
                                            var displayreso = $('#specs-list > table:nth-child(5) > tbody > tr:nth-child(3) > td.nfo').text();
                                            var chipset = $('#specs-list > table:nth-child(6) > tbody > tr:nth-child(2) > td.nfo').text();
                                            var merkos = $('#specs-list > table:nth-child(6) > tbody > tr:nth-child(1) > td.nfo').text();
                                            var merkcpu = $('#specs-list > table:nth-child(6) > tbody > tr:nth-child(3) > td.nfo').text();
                                            var internalspek = $('#specs-list > table:nth-child(7) > tbody > tr:nth-child(2) > td.nfo').text();
                                            var spekkamera = $('#specs-list > table:nth-child(8) > tbody > tr:nth-child(1) > td.nfo').text();
                                            var spekbatre = $('#specs-list > table:nth-child(13) > tbody > tr:nth-child(1) > td.nfo').text();
                                            var allresultspek = `「 *RESULT FOUND!*」

• Spek: ${judulitem}
• Display Tipe: ${displaytipe}
• Display Size: ${displaySize}
• Display Resolusi: ${displayreso}
• Chipset: ${chipset}
• OS: ${merkos}
• Cpu: ${merkcpu}
• Internal: ${internalspek}
• Kamera: ${spekkamera}
• Batterai: ${spekbatre}
`
                                            reply(mess.wait)
                                            sendFileFromUrl(from, urlimage, allresultspek, msg)
                                        })
                                    }
                                })
                            })

                        }
                    })
                } catch (err) {
                    sendMess(ownerNumber, 'google Error : ' + err)
                    console.log(color('[google]', 'red'), err)
                    reply(mess.error.api)
                }
                break
            case prefix+'google':
                if (args.length === 1) return reply(`Kirim perintah ${prefix}google *query*\n\nExample: ${prefix}google bot`)
                google({ 'query': q, 'disableConsole': true}).then(results => {
                    let vars = `「 *GOOGLE-SEARCH* 」\n\n_Hasil Pencarian : ${q}_\n\n`
                    for (let i = 0; i < results.length; i++) {
                        vars += `• Judul: ${results[i].title}\n• Link: ${results[i].link}\n• Deskripsi: ${results[i].snippet}\n\n`
                    }
                    reply(mess.wait)
                    reply(vars.trim())
                }).catch((err) => {
                    sendMess(ownerNumber, 'google Error : ' + err)
                    console.log(color('[google]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'dewabatch':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}dewabatch query*`)

                const dewabatchSearch = (query) => new Promise((resolve, reject) => {
                    axios.get(`https://dewabatch.com/?s=${query}`).then((res) => {
                        const $ = cheerio.load(res.data)
                        const dataArr = [];
                        $('div.dtl').each((i, el) => {
                            const title = $(el).find('h2 > a').text().trim();
                            const url = $(el).find('h2 > a').attr('href');
                            const rating = $(el).find(' div.footer-content-post.fotdesktoppost > div.contentleft > span:nth-child(1) > rating > ratingval > ratingvalue').text().trim();
                            const uploadAt = $(el).find('div.footer-content-post.fotdesktoppost > div.contentleft > span:nth-child(2) > a').text().trim();
                            const desc = $(el).find('div.entry-content.synopspost').text().trim();
                            dataArr.push({
                                title: title,
                                rating: rating,
                                uploadAt: uploadAt,
                                url: url,
                                desc: desc
                            })
                        })
                        resolve({
                            status: 200,
                            data: dataArr
                        })
                    })
                })

                dewabatchSearch(q).then(data => {
                    let text_ = `「 *DEWABATCH-SEARCH* 」\n\n`
                    for (let x = 0; x < data.data.length; x++) {
                        text_ += `• Judul: ${data.data[x].title}\n• Rating: ${data.data[x].rating}\n• UploadAt: ${data.data[x].uploadAt}\n• Url: ${data.data[x].url}\n• Desc: ${data.data[x].desc}\n\n`
                    }
                    reply(text_.trim())
                }).catch(async (err) => {
                    sendMess(ownerNumber, 'Dewabatch Error : ' + err)
                    console.log(color('[Dewabatch]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'pinterest':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}pinterest query*`)

                async function pinterestSearch(query) {
                    return new Promise((resolve, reject) => {
                        fetch(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`, {
                            "headers": {
                                "accept": "application/json, text/javascript, */*, q=0.01",
                                "accept-language": "en-US,en;q=0.9",
                                "cache-control": "no-cache",
                                "pragma": "no-cache",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "sec-gpc": "1",
                                "x-app-version": "9a236a4",
                                "x-pinterest-appstate": "active",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            "referrer": "https://www.pinterest.com/",
                            "referrerPolicy": "origin",
                            "body": null,
                            "method": "GET",
                            "mode": "cors"
                        }).then((res) => res.json())
                            .then((json) => {
                                const generatepin = json.resource_response.data.results[Math.floor(Math.random() * (json.resource_response.data.results.length))]
                                var result = [];
                                result.push({
                                    link: generatepin.images.orig.url
                                })
                                resolve(result)
                            }).catch(reject)
                    })
                }

                const pinterest = (query) => new Promise((resolve, reject) => {
                    pinterestSearch(query).then((data) => {
                        resolve({
                            status: 200,
                            image: data[0].link
                        })
                    }).catch(reject)
                })

                pinterest(q).then(async(res) => {
                    await reply(mess.wait)
                    await sendFileFromUrl(from, res.image, `Hasil Pencarian: ${q}`, msg)
                }).catch(async(err) => {
                    sendMess(ownerNumber, 'Pinterest Error : ' + err)
                    console.log(color('[Pinterest]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'gplay':
            case prefix+'playstore':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}playstore query*`)
                try {
                    reply(mess.wait)
                    gplay.search({
                        term: q,
                        num: 1
                    })
                        .then(async (hasil) => {
                            var resultpstore = `「 *PLAYSTORE* 」
  
• Judul: ${hasil[0].title}
• Packname: ${hasil[0].appId}
• Developer: ${hasil[0].developer}
• Summary: ${hasil[0].summary}
• Ratings: ${hasil[0].scoreText}
• Link: ${hasil[0].url}`
                            await sendFileFromUrl(from, hasil[0].icon, resultpstore, msg)
                        }).catch(async (err) => {
                            await reply(`Hasil ${q} tidak ditemukan`)
                        })
                } catch (err) {
                    sendMess(ownerNumber, 'Playstore Error : ' + err)
                    console.log(color('[Playstore]', 'red'), err)
                    reply(mess.error.api)
                }
                break
            case prefix+'foliokiri':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokiri* teks`)
                reply(mess.wait)
                const tulisan = body.slice(11)
                const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
                spawn('convert', [
                    './media/nulis/images/folio/sebelumkiri.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '1720x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '4',
                    '-annotate',
                    '+48+185',
                    fixHeight,
                    './media/nulis/images/folio/setelahkiri.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    ramlan.sendMessage(from, fs.readFileSync('./media/nulis/images/folio/setelahkiri.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'foliokanan':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}foliokanan* teks`)
                reply(mess.wait)
                const tulisan = body.slice(12)
                const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
                const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
                spawn('convert', [
                    './media/nulis/images/folio/sebelumkanan.jpg',
                    '-font',
                    './media/nulis/font/Indie-Flower.ttf',
                    '-size',
                    '960x1280',
                    '-pointsize',
                    '23',
                    '-interline-spacing',
                    '3',
                    '-annotate',
                    '+89+190',
                    fixHeight,
                    './media/nulis/images/folio/setelahkanan.jpg'
                ])
                .on('error', () => reply(mess.error.api))
                .on('exit', () => {
                    ramlan.sendMessage(from, fs.readFileSync('./media/nulis/images/folio/setelahkanan.jpg'), image, {quoted: msg, caption: `Jangan malas pak...`})
                    limitAdd(sender, limit)
                })
            }
                break
            case prefix+'troligc':{
                if (!isOwner && !fromMe) return
                let faketroli = {
                    key: {
                        participant: '0@s.whatsapp.net' // Fake sender Jid
                    },
                    message: {
                        orderMessage: {
                            itemCount: 9999999, // Bug
                            status: 1,
                            surface: 1,
                            message: 'Awokawok',
                            orderTitle: '????', // Idk what this does
                            sellerJid: '0@s.whatsapp.net' // Seller
                        }
                    }
                }
                for(let i = 0; i < args[1]; i++){
                    ramlan.sendMessage(from, 'P', MessageType.extendedText, {quoted: faketroli})
                    .then(res => ramlan.clearMessage(res.key))
                }
            }
                break
            case prefix+'trolipc':{
                if (!isOwner && !fromMe) return
                let faketroli = {
                    key: {
                        fromMe: false,
                        participant: from,
                        remoteJid: from // Fake sender Jid
                    },
                    message: {
                        orderMessage: {
                            itemCount: 9999999, // Bug
                            status: 1,
                            surface: 1,
                            message: 'Awokawok',
                            orderTitle: '????', // Idk what this does
                            sellerJid: '0@s.whatsapp.net' // Seller
                        }
                    }
                }
                for(let i = 0; i < args[1]; i++){
                    ramlan.sendMessage(from, 'P', MessageType.extendedText, {quoted: faketroli})
                    .then(res => ramlan.clearMessage(res.key))
                }
            }
                break
            case prefix+'listsw':{
                if (!isOwner && !fromMe) return
                let rapih = []
                let stomries = await ramlan.getStories()
                let stomries1 = stomries.map(v => v.messages)
                for (let i = 0; i < stomries1.length; i++){
                    let semder = ramlan.user.jid
                    if (!stomries1[i][0].key){
                        semder = stomries1[i][1].participant
                        stomries1[i].splice(0, 1)
                    } else if (!stomries1[i][0].key.fromMe){
                        semder = stomries1[i][0].participant
                    }
                    rapih.push({
                        sender: semder,
                        stories: stomries1[i]
                    })
                }
                let teg = rapih.map(v => v.sender)
                let tmt = `*LIST STATUS WHATSAPP*\nJumlah sender : ${rapih.length}\n`
                for (let i = 0; i < rapih.length; i++){
                    let mesek = rapih[i].stories
                    tmt += `\n${1 + i}. @${rapih[i].sender.split("@")[0]}\n`
                    tmt += `=> Jumlah : ${rapih[i].stories.length}\n`
                    for (let a = 0; a < mesek.length; a++){
                        let tipe = Object.keys(mesek[a].message)[0]
                        tmt += `==> ${1 + a}. ${tipe}\n`
                    }
                }
                tmt += `\nUntuk mengambil sw, silahkan kirim ${prefix}getsw nomor sender(spasi)nomor sw\n\nContoh : ${prefix}getsw 1 1`
                mentions(tmt, teg, true)
            }
                break
            case prefix+'getsw':{
                if (!isOwner && !fromMe) return
                if (args.length < 2) return reply(`Penggunaan ${command} nomor sender(spasi)nomor sw\n\nContoh : ${command} 1 1`)
                if (isNaN(args[1])) return reply(`Penggunaan ${command} nomor sender(spasi)nomor sw\n\nContoh : ${command} 1 1`)
                if (isNaN(args[2])) return reply(`Penggunaan ${command} nomor sender(spasi)nomor sw\n\nContoh : ${command} 1 1`)
                try {
                    let rapih = []
                    let stomries = await ramlan.getStories()
                    let stomries1 = stomries.map(v => v.messages)
                    for (let i = 0; i < stomries1.length; i++){
                        let semder = ramlan.user.jid
                        if (!stomries1[i][0].key){
                            semder = stomries1[i][1].participant
                            stomries1[i].splice(0, 1)
                        } else if (!stomries1[i][0].key.fromMe){
                            semder = stomries1[i][0].participant
                        }
                        rapih.push({
                            sender: semder,
                            stories: stomries1[i]
                        })
                    }
                    let swnya = rapih[args[1] - 1].stories[args[2] - 1]
                    let tipenya = Object.keys(swnya.message)[0]
                    if (tipenya == 'extendedTextMessage'){
                        ramlan.sendMessage(from, swnya.message[tipenya].text, text, {quoted: swnya})
                    } else {
                        let media = await ramlan.downloadMediaMessage(swnya)
                        ramlan.sendMessage(from, media, tipenya, {quoted: swnya, caption: swnya.message[tipenya].caption})
                    }
                } catch (err) {
                    console.log(err)
                    reply(`SW tidak ditemukan`)
                }
            }
                break
            case prefix+'resend':{
                if (!isQuotedMsg) return reply(`reply message yang ingin di download`)
                if (!isQuotedImage && !isQuotedVideo) return reply(`Hanya bisa download pesan media`)
                let encmedia = isQuotedMsg ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                let media = await ramlan.downloadMediaMessage(encmedia)
                ramlan.sendMessage(from, media, quotedMsg.type)
            }
                break
            case prefix+'save':{
                if (!isOwner) return reply(mess.OnlyOwner)
                if (!isQuotedMsg) return reply(`reply message yang ingin di download`)
                if (!isQuotedImage && !isQuotedVideo && !isQuotedSticker) return reply(`Hanya bisa download pesan media`)
                const cmd_sticker = JSON.parse(fs.readFileSync('./database/cmd-sticker.json'))
                cmd_sticker.push(quotedMsg[quotedMsg.type].url)
                let encmedia = isQuotedMsg ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                let media = await ramlan.downloadAndSaveMediaMessage(encmedia, args[1])
                reply(`Sukses`)
            }
                break
case prefix+'getmember':
                if (!isOwner) return reply(mess.OnlyOwner)
                let listnumber2 = JSON.parse(fs.readFileSync('./listnumber.json'))
                for (let i of groupMembers) {
                    listnumber2.push(i.jid)
                    fs.writeFileSync('./listnumber.json', JSON.stringify(listnumber2))
                }
                reply('success')
                break
            case prefix+'culik':
                if (!isOwner) return reply(mess.OnlyOwner)
                const jumlahpeople = q.split('|')[0] ? q.split('|')[0] : q
                const groupidnya = q.split('|')[1] ? q.split('|')[1] : ''
                if (!jumlahpeople && !groupidnya) return reply(`Format salah!, Masukan GroupID yang ingin diisi + jadikan bot admin\n\nKirim perintah: ${prefix}culik *jumlah org*|*groupid*\nContoh: ${prefix}culik 50|6281234-123456@g.us`)
                const sleeping = async (ms) => {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                let listnumber = JSON.parse(fs.readFileSync('./listnumber.json'))
                let splitmuch = listnumber.slice(0, jumlahpeople)
                for (let x = 0; x < splitmuch.length; x++) {
                    try {
                        ramlan.groupAdd(groupidnya, [listnumber[x]])
                        sleeping(2000)
                    } catch (err) {
                        reply(`Gagal invit ${listnumber[x]}`)
                    }
                }
                reply('done')
                break
            case prefix+'getpp': 
            case prefix+'getpic':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Penggunaan ${command} @tag atau 'group'`)
                if (args[1] === 'group'){
                    reply(mess.wait)
                    try {
                        var pic = await ramlan.getProfilePicture(from)
                    } catch {
                        var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                    }
                    ramlan.sendImage(from, await getBuffer(pic), 'Nih bang', msg)
                    limitAdd(sender, limit)
                } else if (mentioned.length !== 0){
                    reply(mess.wait)
                    try {
                        var pic = await ramlan.getProfilePicture(mentioned[0])
                    } catch {
                        var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                    }
                    ramlan.sendImage(from, await getBuffer(pic), 'Nih bang', msg)
                    limitAdd(sender, limit)
                } else {
                    reply(`Penggunaan ${command} @tag atau 'group'`)
                }
                break
            case prefix+'tagme':
                mentions(`@${sender.split("@")[0]} Sayang😚`, [sender], true)
                break
            case prefix+'kontak':
                if (args.length < 2) return reply(`Penggunaan ${command} nomor|nama\n\nContoh : ${command} 0|Mark asu`)
                if (!q.includes("|")) return reply(`Penggunaan ${command} nomor|nama\n\nContoh : ${command} 0|Mark asu`)
                if (isNaN(q.split("|")[0])) return reply(`Penggunaan ${command} nomor|nama\n\nContoh : ${command} 0|Mark asu`)
                ramlan.sendContact(from, q.split("|")[0], q.split("|")[1], msg)
                break
            case prefix+'hidetag':{
                if (!isPremium) return reply(mess.OnlyPrem)
                if (args.length < 2) return reply(`Masukkan text`)
                let arr = [];
                for (let i of groupMembers){
                    arr.push(i.jid)
                }
                mentions(q, arr, false)
            }
                break
            case prefix+'revokelink':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                await ramlan.revokeInvite(from)
                mentions(`Link group has been revoke by admin @${sender.replace('@s.whatsapp.net', '')}`, [sender], true)
                break
            case prefix+'antidelete':
                if (!isOwner && !fromMe && !isGroupAdmins) return reply(mess.GrupAdmin)
				const dataRevoke = JSON.parse(fs.readFileSync('./database/gc-revoked.json'))
				const dataCtRevoke = JSON.parse(fs.readFileSync('./database/ct-revoked.json'))
				const dataBanCtRevoke = JSON.parse(fs.readFileSync('./database/ct-revoked-banlist.json'))
				const isRevoke = dataRevoke.includes(from)
				const isCtRevoke = dataCtRevoke.data
				const isBanCtRevoke = dataBanCtRevoke.includes(sender) ? true : false
				if (args.length === 1) return reply(`Penggunaan fitur antidelete :\n\n*${prefix}antidelete [aktif/mati]* (Untuk grup)\n*${prefix}antidelete [ctaktif/ctmati]* (untuk semua kontak)\n*${prefix}antidelete banct 628558xxxxxxx* (banlist kontak)`)
				if (args[1] == 'aktif') {
					if (isGroup) {
						if (isRevoke) return reply(`Antidelete telah diaktifkan di grup ini sebelumnya!`)
						dataRevoke.push(from)
						fs.writeFileSync('./database/gc-revoked.json', JSON.stringify(dataRevoke, null, 2))
						reply(`Antidelete diaktifkan di grup ini!`)
					} else if (!isGroup) {
						reply(`Untuk kontak penggunaan *${prefix}antidelete ctaktif*`)
					}
				} else if (args[1] == 'ctaktif') {
                    if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
					if (!isGroup) {
						if (isCtRevoke) return reply(`Antidelete telah diaktifkan di semua kontak sebelumnya!`)
						dataCtRevoke.data = true
						fs.writeFileSync('./database/ct-revoked.json', JSON.stringify(dataCtRevoke, null, 2))
						reply(`Antidelete diaktifkan disemua kontak!`)
					} else if (isGroup) {
						reply(`Untuk grup penggunaan *${prefix}antidelete aktif*`)
					}
				} else if (args[1] == 'banct') {
                    if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
					if (isBanCtRevoke) return reply(`kontak ini telah ada di database banlist!`)
					if (args.length === 2 || args[2].startsWith('0')) return reply(`Masukan nomer diawali dengan 62! contoh 62859289xxxxx`)
					dataBanCtRevoke.push(args[2] + '@s.whatsapp.net')
					fs.writeFileSync('./database/ct-revoked-banlist.json', JSON.stringify(dataBanCtRevoke, null, 2))
					reply(`Kontak ${args[2]} telah dimasukan ke banlist antidelete secara permanen!`)
				} else if (args[1] == 'mati') {
					if (isGroup) {
						const index = dataRevoke.indexOf(from)
						dataRevoke.splice(index, 1)
						fs.writeFileSync('./database/gc-revoked.json', JSON.stringify(dataRevoke, null, 2))
						reply(`Antidelete dimatikan di grup ini!`)
					} else if (!isGroup) {
						reply(`Untuk kontak penggunaan *${prefix}antidelete ctmati*`)
					}
				} else if (args[1] == 'ctmati') {
                    if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
					if (!isGroup) {
						dataCtRevoke.data = false
						fs.writeFileSync('./database/ct-revoked.json', JSON.stringify(dataCtRevoke, null, 2))
						reply(`Antidelete dimatikan disemua kontak!`)
					} else if (isGroup) {
						reply(`Untuk grup penggunaan *${prefix}antidelete mati*`)
					}
				}
				break
            case prefix+'limit': 
            case prefix+'ceklimit': 
            case prefix+'balance': 
            case prefix+'glimit':
                if (mentioned.length !== 0){
                    reply(`Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : `${getLimit(mentioned[0], limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(mentioned[0], gcount, glimit)}/${gcount}\nBalance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                } else {
                    reply(`Limit : ${isPremium ? 'Unlimited' : `${getLimit(sender, limitCount, limit)}/${limitCount}`}\nLimit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\nBalance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit dan ${prefix}buyglimit untuk membeli game limit`)
                }
                break
            case prefix+'owner':
            case prefix+'creator':
                ramlan.sendContact(from, ownerNumber.split("@")[0], 'Novem', msg)
                .then((res) => ramlan.sendMessage(from, 'Tuh Nomor Ownerku~', text, {quoted: res}))
                break
            case prefix+'info':
                let data_info = `「 *INFORMATION* 」
                
• BOT Type: NodeJS v16.x.x
• Name: ${setting.botName}
• Lib: Baileys
• Version: 1.0.0

*THANKS TO*
• Allah SWT
• Hizkia ID
• Ramlan ID
• Novem ID
• MrG3P5
• Aqulz
• And All creator bot
_Since © 2022_`
                reply(data_info)
                break
            case prefix+'runtime':
                reply(`${runtime(process.uptime())}`)
                break
            case prefix+'stats': 
            case prefix+'botstatus':
            case prefix+'ping':
            case prefix+'botstat':{
                let totalchat = await ramlan.chats.all()
                let sisalimit = getLimit(sender, limitCount, limit)
                let sisaGlimit = cekGLimit(sender, gcount, glimit)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let expiredPrem = () => {
                    if (cekvip.days != 0){
                        return `${cekvip.days} day(s)`
                    } else if (cekvip.hours != 0){
                        return `${cekvip.hours} hour(s)`
                    } else if (cekvip.minutes != 0){
                        return `${cekvip.minutes}`
                    }
                }
				let i = []
				let giid = []
				for (let mem of totalchat){
					i.push(mem.jid)
				}
				for (let id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = ramlan.user.phone
                let anu = process.uptime()
                let teskny = `「 *STATUS-INFORMATION* 」

*SERVER-STATUS*
• *Host:* ${os.hostname()}
• *Platfrom:* ${os.platform()}
• *Speed:* ${os.cpus()[0].speed} MHz
• *Core:* ${os.cpus().length}
• *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
• *CPU:* ${os.cpus()[0].model}
• *Release:* ${os.release()}

*BOT-STATUS*
• *V. Whatsapp:* ${wa_version}
• *Baterai:* ${ramlan.baterai.baterai}%
• *Charge:* ${ramlan.baterai.cas === 'true' ? 'Ya' : 'Tidak'}
• *MCC:* ${mcc}
• *MNC:* ${mnc}
• *Versi OS:* ${os_version}
• *Merk HP:* ${device_manufacturer}
• *Versi HP:* ${device_model}
• *Group Chat:* ${giid.length}
• *Personal Chat:* ${totalchat.length - giid.length}
• *Total Chat:* 3${totalchat.length}
• *Speed:* ${latensii.toFixed(4)} Second
• *Runtime:* ${runtime(anu)}`
				let img = await ramlan.prepareMessage("0@s.whatsapp.net",fs.readFileSync(setting.pathImg), MessageType.image);
        ( img.message.imageMessage.jpegThumbnail = fs.readFileSync(setting.pathImg)), { encoding: "base64" };
        const buttonmsg = {
          imageMessage: img.message.imageMessage,
          contentText: "ＷｈａｔｓＡｐｐ - Ｂｏｔ",
          footerText: teskny,
          headerType: "IMAGE",
          buttons: [
            {buttonText: { displayText: "MENU" }, type: 1, buttonId: "a1" },
            {buttonText: { displayText: "SEWABOT" },type: 1, buttonId: "a2" },
            {buttonText: { displayText: "SYARAT & KETENTUAN" }, type: 1, buttonId: "a3"},
          ],
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  videoMessage: {
                    mimetype: "video/mp4",
                    viewOnce: true,
                  },
                },
              },
            },
          },
        };
        ramlan.sendMessage(from, buttonmsg, MessageType.buttonsMessage);
     }
     break
            case prefix+'ytmp4':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}ytmp4 [linkYt]*`)
                let isLinks2 = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinks2) return reply(mess.error.Iv)
                try {
                    reply(mess.wait)
                    ytv(args[1])
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 40000) return sendFileFromUrl(from, thumb, `「 *YOUTUBE-MP4* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP4
• Filesize: ${filesizeF}
• Link: ${a.data}

_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                            const captionsYtmp4 = `「 *YOUTUBE-MP4* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP4
• Size: ${filesizeF}

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionsYtmp4, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'Ytmp4 Error : ' + err)
                    console.log(color('[Ytmp4]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'ytmp3':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}ytmp3 [linkYt]*`)
                let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinks) return reply(mess.error.Iv)
                try {
                    reply(mess.wait)
                    yta(args[1])
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 30000) return sendFileFromUrl(from, thumb, `「 *YOUTUBE-MP3* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP3
• Filesize: ${filesizeF}
• Link: ${a.data}

_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                            const captions = `「 *YOUTUBE-MP3* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP3
• Size: ${filesizeF}

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captions, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply('terjadi kesalahan'))
                } catch (err) {
                    sendMess(ownerNumber, 'Ytmp3 Error : ' + err)
                    console.log(color('[Ytmp3]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'playmp4':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}playmp4 query*`)
                try {
                    reply(mess.wait)
                    let yut = await yts(q)
                    ytv(yut.videos[0].url)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 40000) return sendFileFromUrl(from, thumb, `「 *PLAYING-YTMP4* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP4
• Filesize: ${filesizeF}
• ID: ${yut.videos[0].videoId}
• Upload: ${yut.videos[0].ago}
• Ditonton: ${yut.videos[0].views}
• Duration: ${yut.videos[0].timestamp}
• Link: ${a.data}

_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captionisu = `「 *PLAYING-YTMP4* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP4
• Size: ${filesizeF}
• ID: ${yut.videos[0].videoId}
• Upload: ${yut.videos[0].ago}
• Ditonton: ${yut.videos[0].views}
• Duration: ${yut.videos[0].timestamp}
• URL: ${yut.videos[0].url}

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionisu, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                    .catch((err) => reply(`${err}`))
                } catch (err) {
                    sendMess(ownerNumber, 'PlayMp4 Error : ' + err)
                    console.log(color('[PlayMp4]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'play': 
            case prefix+'playmp3':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length === 1) return reply(`Kirim perintah *${prefix}play query*`)
                try {
                    reply(mess.wait)
                    let yut = await yts(q)
                    yta(yut.videos[0].url)
                    .then((res) => {
                        const { dl_link, thumb, title, filesizeF, filesize } = res
                        axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
                        .then((a) => {
                            if (Number(filesize) >= 30000) return sendFileFromUrl(from, thumb, `「 *PLAYING-YTMP3* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP3
• Filesize: ${filesizeF}
• ID: ${yut.videos[0].videoId}
• Upload: ${yut.videos[0].ago}
• Ditonton: ${yut.videos[0].views}
• Duration: ${yut.videos[0].timestamp}
• Link: ${a.data}

_Untuk durasi lebih dari batas disajikan dalam bentuk link_`, msg)
                        const captionis = `「 *PLAYING-YTMP3* 」

*Data Berhasil Didapatkan!*

• Title: ${title}
• Ext: MP3
• Size: ${filesizeF}
• ID: ${yut.videos[0].videoId}
• Upload: ${yut.videos[0].ago}
• Ditonton: ${yut.videos[0].views}
• Duration: ${yut.videos[0].timestamp}
• URL: ${yut.videos[0].url}

_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                            sendFileFromUrl(from, thumb, captionis, msg)
                            sendFileFromUrl(from, dl_link, '', msg)
                            limitAdd(sender, limit)
                        })
                    })
                } catch (err) {
                    sendMess(ownerNumber, 'PlayMp3 Error : ' + err)
                    console.log(color('[PlayMp3]', 'red'), err)
                    reply(mess.error.api)
                }
            }
                break
            case prefix+'igstalk': case prefix+'stalkig':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}igstalk* _username_`)
                reply(mess.wait)
                axios.get(`https://api-ramlan.herokuapp.com/api/igstalk?username=${args[1]}&apikey=${apikey}`)
                .then(({data}) => {
                let { username, fullname, Urlprofile, biography, follower_count, following_count, post_count } = data
                    let caption = `┏┉⌣ ┈̥-̶̯͡..̷̴✽̶┄┈┈┈┈┈┈┈┈┈┈┉┓
┆ *INSTAGRAM PROFILE*
└┈┈┈┈┈┈┈┈┈┈┈⌣ ┈̥-̶̯͡..̷̴✽̶⌣ ✽̶

*Data Berhasil Didapatkan!*
\`\`\`▢ Username : ${username}\`\`\`
\`\`\`▢ Fullname : ${fullname}\`\`\`
\`\`\`▢ Followers : ${follower_count}\`\`\`
\`\`\`▢ Following : ${following_count}\`\`\`
\`\`\`▢ Post Count : ${post_count}\`\`\`
\`\`\`▢ Biography :\`\`\` \n${biography}`
                    sendFileFromUrl(from, Urlprofile, caption, msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'IG Stalk Error : ' + err)
                    console.log(color('[IG Stalk]', 'red'), err)
					reply(mess.error.api)
                })
            }
                break
            case prefix+'ig':
            case prefix+'igdl':
            case prefix+'instagram':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ig* link ig`)
                if (!isUrl(args[1]) && !args[1].includes('instagram.com')) return reply(mess.error.Iv)
                fetch("https://instasave.website/download#downloadhere", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Upgrade-Insecure-Requests": "1"
                    },
                    "referrer": "https://instasave.website/",
                    "body": `link=${q}&submit=`,
                    "method": "POST",
                    "mode": "cors"
                }).then((res) => res.text())
                    .then((text) => {
                        const $ = cheerio.load(text)
                        const url__ = $('#downloadBox > a:nth-child(3)').attr('href');
                        reply(mess.wait)
                        sendFileFromUrl(from, url__, 'nih', msg)
                        limitAdd(sender, limit)
                    })
                .catch((err) => {
                    sendMess(ownerNumber, 'IG Download Error : ' + err)
                    console.log(color('[IG Download]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'npmjs':
                if (!q) return reply(`Kirim perintah ${prefix}npmjs *query*\nContoh: ${prefix}npmjs axios`)
                axios.get(`https://www.npmjs.com/search/suggestions?q=${q}`).then(x => {
                    let listnpm = "*「 NPMJS-SEARCH 」*\n\n"
                    for (let y = 0; y < x.data.length; y++) {
                        listnpm += `• *Name:* ${x.data[y].name}\n• *Scope:* ${x.data[y].scope}\n• *Publisher:* ${x.data[y].publisher.username}\n• *Link:* ${x.data[y].links.npm}\n• *Date:* ${x.data[y].date}\n• *Description:* ${x.data[y].description}\n\n`
                    }
                    sendFileFromUrl(from, "https://static.npmjs.com/5f6e93af5bf0f5dcdd1eecdac99f51ee.png", listnpm.trim(), msg)
                  }).catch((err) => {
                    sendMess(ownerNumber, 'Npmjs Error : ' + err)
                    console.log(color('[Npmjs]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'fb':
            case prefix+'fbdl':
            case prefix+'facebook':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}fb* url`)
                if (!isUrl(args[1]) && !args[1].includes('facebook.com')) return reply(mess.error.Iv)
                reply(mess.wait)
                fbdl(args[1])
                .then((res) => {
                    sendFileFromUrl(from, res.result.links[0].url)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'FB Error : ' + err)
                    console.log(color('[FB]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'yts':
            case prefix+'ytsearch':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah ${prefix}ytsearch *query*`)
                reply(mess.wait)
                yts(q)
                .then((res) => {
                    let yt = res.videos
                    let txt = `「 *YOUTUBE-SEARCH* 」

*Data Berhasil Didapatkan!*
*Hasil Pencarian : ${q}*\n\n`
                    for (let i = 0; i < 10; i++){
                        txt += `• Judul: ${yt[i].title}\n• ID: ${yt[i].videoId}\n• Upload: ${yt[i].ago}\n• Ditonton: ${yt[i].views}\n• Duration: ${yt[i].timestamp}\n• URL: ${yt[i].url}\n\n`
                    }
                    sendFileFromUrl(from, yt[0].image, txt.trim(), msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'YT SEARCH Error : ' + err)
                    console.log(color('[YT SEARCH]', 'red'), err)
                    reply(mess.error.api)
                })
            }
                break
            case prefix+'ghstalk': 
            case prefix+'githubstalk': 
            case prefix+'ghuser':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}ghstalk* _username_`)
                reply(mess.wait)
                axios.get(`https://api.github.com/users/${args[1]}`)
                .then((res) => res.data)
                .then((res) =>{
                    let { login, type, name, followers, following, created_at, updated_at, public_gists, public_repos, twitter_username, bio, hireable, email, location, blog, company, avatar_url, html_url } = res
                    let txt = `「 *GITHUB-STALKING* 」

*Data Berhasil Didapatkan!*

• Username: ${login}
• Name: ${name ? name : 'tidak ada'}
• Followers: ${followers}
• Following: ${following}
• Created at:  ${moment(created_at).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}
• Updated at: ${moment(updated_at).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}
• Public Gists: ${public_gists}
• Public Repos: ${public_repos}
• Twitter: ${twitter_username ? twitter_username : 'tidak ada'}
• Email: ${email ? email : 'tidak ada'}
• Location: ${location}
• Blog: ${blog ? blog : 'tidak ada'}
• Link: ${html_url}
• Bio: ${bio}`
                    sendFileFromUrl(from, avatar_url, txt, msg)
                    limitAdd(sender, limit)
                })
                .catch((err) => {
                    sendMess(ownerNumber, 'GH Stalk Error : ' + err)
                    console.log(color('[GH Stalk]', 'red'), err)
					reply(mess.error.api)
                })
            }
                break
            case prefix+'premium': case prefix+'buyprem': case prefix+'daftarprem': case prefix+'sewabot': case prefix+'sewa':{
            let qrisnya = await getBuffer('https://i.ibb.co/ftvG4TL/719ab74eb46c.jpg')
            let teksewa = ` Ｗｈａｔｓａｐｐ - Ｂｏｔ

*Sewabot NoPrem:*
1 Minggu Rp 5.000
1 Bulan Rp 10.000
1 Tahun Rp 100.000
*Sewabot + Prem:*
1 Minggu Rp 10.000
1 Bulan Rp 15.000
1 Tahun Rp 110.000

*𝙽𝚘𝚝𝚎:*
𝚂𝚎𝚠𝚊 : 𝙱𝚘𝚝 𝙼𝚊𝚜𝚞𝚔 𝙶𝚛𝚘𝚞𝚙
𝙿𝚛𝚎𝚖𝚒𝚞𝚖 : 𝚄𝚙𝚐𝚛𝚊𝚍𝚎 𝚂𝚝𝚊𝚝𝚞𝚜 𝚄𝚜𝚎𝚛

𝙺𝚒𝚛𝚒𝚖 𝚋𝚞𝚔𝚝𝚒 𝚝𝚛𝚊𝚗𝚜𝚏𝚎𝚛 𝚔𝚎👇
wa.me/${ownerNumber.split("@")[0]}

_𝚁𝚎𝚐𝚊𝚛𝚍𝚜 : Novem_`
                ramlan.sendMessage(from, qrisnya, MessageType.image,
                {
                quoted: {
                key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) },
                message: { "imageMessage": {
                "mimetype": "image/jpeg", 
                "caption": "*POWERED BY NOVEM*", 
                "jpegThumbnail": fs.readFileSync(setting.pathImg)
                }
           }
     },
     caption: teksewa
     })
            }
                break
           /* case prefix+'sewa':
                if (isGroup) return reply( `Untuk membuat pesanan sewa silahkan chat bot di private wa.me/${ramlan.user.jid.replace(/@.+/g, '')}`)
                if (!fs.existsSync(sewaPath + '/' + sender + '.json')) {
                    if (args[1] == 'batal') {
                        fs.unlinkSync(sewaPath + '/' + sender + '.json')
                        reply( `Oke kak pesanan sewa bot telah dibatalkan 😉`)
                    } else {
                        let objsewa = {
                            status: false,
                            ID: require('crypto').randomBytes(8).toString("hex").toUpperCase(),
                            session: 'name',
                            name: pushname,
                            created_at: new Date(),
                            number: sender,
                            data: {
                                name: '',
                                bulan: '',
                                payment: '',
                                phone: '',
                                grouplink: '',
                            }
                        }
                        let dataID = JSON.parse(fs.readFileSync(sewaPath + '/ids-match.json'))
                        dataID.push({ SID: objsewa['ID'], PAID: '', data: objsewa })
                        fs.writeFileSync(sewaPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                        fs.writeFile(sewaPath + '/' + sender + '.json', JSON.stringify(objsewa, null, 3), () => {
                            reply( `Baik kak silahkan ketik disini atas nama siapa 😊`)
                        })
                    }
                } else {
                    if (args[1] == 'batal') {
                        let data_sewa = JSON.parse(fs.readFileSync(sewaPath + '/' + sender + '.json'))
                        let dataID = JSON.parse(fs.readFileSync(sewaPath + '/ids-match.json'))
                        let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                        dataID.splice(indexData_sewa, 1)
                        fs.writeFileSync(sewaPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                        fs.unlinkSync(sewaPath + '/' + sender + '.json')
                        reply( `Oke kak pesanan sewa bot telah dibatalkan 😉`)
                    } else {
                        ramlan.sendMessage(from, `Maaf anda sedang ada didalam sesi pembayaran, untuk membatalkannya ketik *!sewa batal*\n\nUntuk lebih jelasnya atau apabila ada kendala silahkan hubungi : @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                    }
                }
                break*/
            case prefix+'addsewa':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addsewa* linkgc waktu`)
                let ceh = await ramlan.cekInviteCode(args[1].replace('https://chat.whatsapp.com/', ''))
                if (ceh.status === 200){
                    ramlan.acceptInvite(args[1].replace('https://chat.whatsapp.com/', ''))
                    .then((res) => {
                        _sewa.addSewaGroup(res.gid, args[2], sewa)
                        reply(`Bot akan segera masuk`)
                    })
                } else {
                    reply(`link salah`)
                }
                break
            case prefix+'delsewa':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* idgroup`)
                sewa.splice(_sewa.getSewaPosition(args[1], sewa), 1)
                fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa))
                reply(`Sukses lur`)
                break
          /*  case prefix+'premium': 
            case prefix+'buyprem': 
            case prefix+'daftarprem':
                if (isGroup) return reply( `Untuk membuat pesanan premium silahkan chat bot di private wa.me/${ramlan.user.jid.replace(/@.+/g, '')}`)
                if (!fs.existsSync(premiumPath + '/' + sender + '.json')) {
                    if (args[1] == 'batal') {
                         fs.unlinkSync(premiumPath + '/' + sender + '.json')
                         reply( `Oke kak pesanan jadi premium telah dibatalkan 😉`)
                    } else {
                        let objsewa = {
                            status: false,
                            ID: require('crypto').randomBytes(8).toString("hex").toUpperCase(),
                            session: 'name',
                            name: pushname,
                            created_at: new Date(),
                            number: sender,
                            data: {
                                name: '',
                                bulan: '',
                                payment: '',
                                phone: '',
                            }
                         }
                        let dataID = JSON.parse(fs.readFileSync(premiumPath + '/ids-match.json'))
                        dataID.push({ SID: objsewa['ID'], PAID: '', data: objsewa })
                        fs.writeFileSync(premiumPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                        fs.writeFile(premiumPath + '/' + sender + '.json', JSON.stringify(objsewa, null, 3), () => {
                            reply( `Baik kak silahkan ketik disini atas nama siapa 😊`)
                        })
                    }
                } else {
                    if (args[1] == 'batal') {
                        let data_sewa = JSON.parse(fs.readFileSync(premiumPath + '/' + sender + '.json'))
                        let dataID = JSON.parse(fs.readFileSync(premiumPath + '/ids-match.json'))
                        let indexData_sewa = dataID.findIndex(r => r['ID'] == data_sewa['ID'])
                        dataID.splice(indexData_sewa, 1)
                        fs.writeFileSync(premiumPath + '/ids-match.json', JSON.stringify(dataID, null, 3))
                        fs.unlinkSync(premiumPath + '/' + sender + '.json')
                        reply( `Oke kak pesanan premium bot telah dibatalkan 😉`)
                    } else {
                        ramlan.sendMessage(from, `Maaf anda sedang ada didalam sesi pembayaran, untuk membatalkannya ketik *!premium batal*\n\nUntuk lebih jelasnya atau apabila ada kendala silahkan hubungi : @${ownerNumber.replace(/@.+/g, '')}`, MessageType.text, { quoted: msg, contextInfo: { mentionedJid: [ownerNumber] } })
                    }
               }
               break*/
            case prefix+'addprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}addprem* @tag waktu\n*${prefix}addprem* nomor waktu`)
                if (mentioned.length !== 0){
                    _prem.addPremiumUser(mentioned[0], args[2], premium)
                    reply('Sukses')
                } else {
                    _prem.addPremiumUser(args[1] + '@s.whatsapp.net', args[2], premium)
                    reply('Sukses')
                }
                break
            case prefix+'delprem':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan :\n*${prefix}delprem* @tag\n*${prefix}delprem* nomor`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        premium.splice(_prem.getPremiumPosition(mentioned[i], premium), 1)
                        fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                    }
                    reply('Sukses')
                } else {
                    premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                }
                break
            case prefix+'cekprem':
            case prefix+'cekpremium':
                if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
                let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
                let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
                reply(premiumnya)
                break
            case prefix+'listprem':
                let txt = `「 *LIST-PREMIUM* 」\n\nJumlah : ${premium.length}\n\n`
                let men = [];
                for (let i of premium){
                    men.push(i.id)
                    let cekvip = ms(i.expired - Date.now())
                    txt += `• *ID:* @${i.id.split("@")[0]}\n• *Expire:* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                }
                mentions(txt, men, true)
                break
            case prefix+'ban':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        addBanned(mentioned[0], args[2], ban)
                    }
                    reply('Sukses')
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa ban Owner`)
                    addBanned(quotedMsg.sender, args[1], ban)
                    reply(`Sukses ban target`)
                } else if (!isNaN(args[1])) {
                    addBanned(args[1] + '@s.whatsapp.net', args[2], ban)
                    reply('Sukses')
                } else {
                    reply(`Kirim perintah ${prefix}ban @tag atau nomor atau reply pesan orang yang ingin di ban`)
                }
                break
            case prefix+'unban':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        unBanned(mentioned[i], ban)
                    }
                    reply('Sukses')
                }if (isQuotedMsg) {
                    unBanned(quotedMsg.sender, ban)
                    reply(`Sukses unban target`) 
                } else if (!isNaN(args[1])) {
                    unBanned(args[1] + '@s.whatsapp.net', ban)
                    reply('Sukses')
                } else {
                    reply(`Kirim perintah ${prefix}unban @tag atau nomor atau reply pesan orang yang ingin di unban`)
                }
                break
            case prefix+'listban':
                let txtx = `「 *LIST-BANNED* 」\n\nJumlah : ${ban.length}\n\n`
                let menx = [];
                for (let i of ban){
                    menx.push(i.id)
                    txtx += `• *ID:* @${i.id.split("@")[0]}\n`
                    if (i.expired === 'PERMANENT'){
                        let cekvip = 'PERMANENT'
                        txtx += `*Expire :* PERMANENT\n\n`
                    } else {
                        let cekvip = ms(i.expired - Date.now())
                        txtx += `• *Expire:* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                    }
                }
                mentions(txtx, menx, true)
                break
            case prefix+'topglobal':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPGLOBAL 」 ──*\n\n'
                let arrTop = []
                for (let i = 0; i < 10; i ++){
                    top += `${i + 1}. @${balance[i].id.split("@")[0]}\n• *Balance:* $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                mentions(top, arrTop, true)
            }
                break
            case prefix+'toplocal':{
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let top = '*── 「 TOPLOCAL 」 ──*\n\n'
                let arrTop = []
                let anggroup = groupMembers.map(a => a.jid)
                for (let i = 0; i < balance.length; i ++){
                    if (arrTop.length >= 10) continue
                    if (anggroup.includes(balance[i].id)) {
                        top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                        arrTop.push(balance[i].id)
                    }
                }
                mentions(top, arrTop, true)
            }
                break
            case prefix+'buylimit':{
                if (global.ramlan.user.jid !== ramlan.user.jid) return reply('Tidak melakukan command ini di dalam bot!\n\nhttps://wa.me/' + global.ramlan.user.jid.split`@`[0] + `?text=${command}`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nContoh : ${command} 5\n\nHarga 1 limit = $100 balance`)
                if (args[1].includes('-')) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+'Jangan menggunakan -'+`\nContoh : ${command} 5`)
                if (isNaN(args[1])) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+'Pembelian limit harus berupa angka'+`\nContoh : ${command} 5`)
                let ane = Number(nebal(args[1]) * 100)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                giveLimit(sender, nebal(args[1]), limit)
                reply(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
                break
            case prefix+'buygamelimit':
            case prefix+'buyglimit':{
                if (global.ramlan.user.jid !== ramlan.user.jid) return reply('Tidak melakukan command ini di dalam bot!\n\nhttps://wa.me/' + global.ramlan.user.jid.split`@`[0] + `?text=${command}`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}buyglimit* jumlah game limit yang ingin dibeli\n\nContoh : ${command} 5\n\nHarga 1 limit = $100 balance`)
                if (args[1].includes('-')) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+'Jangan menggunakan -'+`\nContoh : ${command} 5`)
                if (isNaN(args[1])) return reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+'Pembelian limit harus berupa angka'+`\nContoh : ${command} 5`)
                let ane = Number(nebal(args[1]) * 100)
                if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
                kurangBalance(sender, ane, balance)
                givegame(sender, nebal(args[1]), glimit)
                reply(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
                break
            case prefix+'suit':
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (args.length < 2) return reply(`Penggunaan ${command} gunting/kertas/batu\n\nContoh : ${command} gunting`)
                let suit = ["gunting", "batu", "kertas"];
                let isSuit = suit.includes(q)
                if (isSuit){
                    let suit1 = suit[Math.floor(Math.random() * (suit.length))]
                    let hadi = randomNomor(30)
                    if (q === suit[0]){
                        if (suit1 === "gunting"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nseri`)
                        } else if (suit1 === "batu"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    } else if (q === suit[1]){
                        if (suit1 === "batu"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nSeri`)
                        } else if (suit1 === "kertas"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    } else if (q === suit[2]){
                        if (suit1 === "kertas"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nSeri`)
                        } else if (suit1 === "gunting"){
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu kalah`)
                        } else {
                            reply(`Kamu ${q}\nKomputer  ${suit1}\nKamu menang\nHadiah : ${hadi} balance`)
                            addBalance(sender, hadi, balance)
                        }
                    }
                    gameAdd(sender, glimit)
                } else {
                    reply(body.replace(args[1], "*"+args[1]+"*")+'\n\n'+`Tidak ada pilihan ${args[1]}`+`\nContoh : ${command} gunting`)
                }
                break
            case prefix+'tictactoe': 
            case prefix+'ttt': 
            case prefix+'ttc':
                if (!isGroup)return reply(mess.OnlyGrup)
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (isTicTacToe(from, tictactoe)) return reply(`Masih ada game yg blum selesai`)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                if (mentioned.length !== 0){
						if (mentioned[0] === sender) return reply(`Sad amat main ama diri sendiri`)
                        let h = randomNomor(100)
                        mentions(monospace(`@${sender.split('@')[0]} Menantang Elo @${mentioned[0].split('@')[0]} Untuk Bewan TicTacToe\n\nKirim (Y/T) untuk Lanjut\n\nHadiah : ${h} balance`), [sender, mentioned[0]], false)
                        tictactoe.push({
                            id: from,
                            status: null,
                            hadiah: h,
                            penantang: sender,
                            ditantang: mentioned[0],
                            TicTacToe: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
                        })
                        gameAdd(sender, glimit)
                } else {
                    reply(`Kirim perintah *${prefix}tictactoe* @tag`)
                }
                break
            case prefix+'delttt':
            case prefix+'delttc':
                if (!isGroup)return reply(mess.OnlyGrup)
                if (!isTicTacToe(from, tictactoe)) return reply(`Tidak ada sesi game tictactoe di grup ini`)
                tictactoe.splice(getPosTic(from, tictactoe), 1)
                reply(`Berhasil menghapus sesi tictactoe di grup ini`)
                break
            case prefix+'family100':{
                if (isGame(sender, isOwner, gcount, glimit)) return reply(`Limit game kamu sudah habis`)
                if (game.isfam(from, family100)) return reply(`Masih ada soal yang belum di selesaikan`)
                let anu = await axios.get(`https://api-ramlan.herokuapp.com/api/game/family100?apikey=${apikey}`)
                reply(`*JAWABLAH SOAL BERIKUT*\n\n*Soal :* ${anu.data.soal}\n\nWaktu : ${gamewaktu}s`)
                let anoh = anu.data.jawaban
                game.addfam(from, anoh, gamewaktu, family100)
                gameAdd(sender, glimit)
            }
                break
            case prefix+'listbot':{
                let arrayBot = [];
                let tmx = `「 *LIST-BOT* 」\n\n`
                tmx += `• *Nomor:* @${global.ramlan.user.jid.split("@")[0]}\n`
                tmx += `• *Prefix:* ${global.ramlan.multi ? 'MULTI PREFIX' : global.ramlan.nopref ? 'NO PREFIX' : global.ramlan.prefa}\n`
                tmx += `• *Status:* ${global.ramlan.mode.toUpperCase()}\n\n`
                arrayBot.push(global.ramlan.user.jid)
                for (let i of conns){
                    tmx += `• *Nomor:* @${i.user.jid.split("@")[0]}\n`
                    tmx += `• *Prefix:* ${i.multi ? 'MULTI PREFIX' : i.nopref ? 'NO PREFIX' : i.prefa}\n`
                    tmx += `• *Status:* ${i.mode.toUpperCase()}\n\n`
                    arrayBot.push(i.user.jid)
                }
                tmx += `Total : ${conns.length + 1}`
                mentions(tmx, arrayBot, true)
            }
                break
            case prefix+'stopjadibot':{
                if (global.ramlan.user.jid == ramlan.user.jid) ramlan.reply(from, 'Kenapa nggk langsung ke terminalnya?', msg)
                else {
                    await ramlan.reply(from, 'Bye...', msg).then(() => ramlan.close())
                }
            }
                break
            case prefix+'getcode':{
                if (global.ramlan.user.jid == ramlan.user.jid) ramlan.reply(from, 'Command ini hanya untuk yang jadi bot', msg)
                else global.ramlan.reply(ramlan.user.jid, `${prefix}jadibot ${Buffer.from(JSON.stringify(ramlan.base64EncodedAuthInfo())).toString('base64')}`, msg)
            }
                break
            case prefix+'jadibot':{
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                limitAdd(sender, limit)
                let parent = args[1] && args[1] == 'plz' ? ramlan : global.ramlan
                let auth = false
                if (global.conns.length >= 100) return reply(`Maaf Udah Maksimal Yang Jadibot, coba lain kali`)
                if ((args[0] && args[0] == 'plz') || global.ramlan.user.jid == ramlan.user.jid || ramlan.user.jid == ownerNumber) {
                    let id = global.conns.length
                    let conn = new global.ramlan.constructor()
                    conn.multi = true
                    conn.nopref = false
                    conn.prefa = 'anjing'
                    if (args[1] && args[1].length > 200) {
                        let json = Buffer.from(args[1], 'base64').toString('utf-8')
                        // global.conn.reply(m.isGroup ? m.sender : m.chat, json, m)
                        let obj = JSON.parse(json)
                        await conn.loadAuthInfo(obj)
                        auth = true
                        conn.multi = false
                        conn.nopref = false
                        conn.prefa = args[2] ? args[2] : 'z'
                    }
                    conn.mode = 'public'
                    conn.spam = []
                    conn.baterai = {
                        baterai: 0,
                        cas: false
                    };
                    conn.logger.level = 'warn'
                    conn.browserDescription = ['MacOs', 'Desktop', '3.0']
                    conn.on('qr', async qr => {
                        qrcode.toDataURL(qr, { scale: 8 }, async(err, Durl) => {
                            const data = Durl.replace(/^data:image\/png;base64,/, '')
                            const bufferDataQr = new Buffer.from(data, 'base64');
                            let scan = await parent.sendImage(from, bufferDataQr, 'Scan QR ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk WhatsApp Web\n3. Scan QR ini \nQR Expired dalam 20 detik', msg)
                            setTimeout(() => {
                            parent.deleteMessage(from, scan.key)
                            }, 30000)
                        })
                    })
                    conn.connect().then(async ({user}) => {
                        parent.reply(from, `Berhasil tersambung dengan WhatsApp - mu.\nSekarang kamu berada di mode self, kirim ${prefix}public untuk pindah ke mode public\n*NOTE: Ini cuma numpang*\n` + JSON.stringify(user, null, 2), msg)
                        if (auth) return
                        await parent.sendMessage(user.jid, `Kamu bisa login tanpa qr dengan pesan dibawah ini. untuk mendapatkan kode lengkapnya, silahkan kirim *${prefix}getcode* untuk mendapatkan kode yang akurat`, MessageType.extendedText)
                        parent.sendMessage(user.jid, `${command} ${Buffer.from(JSON.stringify(conn.base64EncodedAuthInfo())).toString('base64')}`, MessageType.extendedText)
                    })
                    conn.on('chat-update', async (qul) =>{
                        if (!qul.hasNewMessage) return
                        qul = qul.messages.all()[0]
                        // Anti oversized
                        if (qul.messageStubType){
                            if (qul.messageStubType == 68){
                                ramlan.modifyChat(qul.key.remoteJid, 'clear')
                            }
                        }

                        if (!qul.message) return
                        if (qul.key && qul.key.remoteJid == 'status@broadcast') return
                        let msg = serialize(conn, qul)
                        // Detect Troli
                        if (msg.message && msg.isBaileys && msg.isQuotedMsg && msg.quotedMsg.type === 'orderMessage'){
                            ramlan.clearMessage(msg.key)
                        }
                        module.exports(conn, msg, blocked, _afk, welcome, left)
                    })
                    conn.on('message-delete', async(json) => {
                        require('./antidelete')(conn, json)
                    })
                    conn.on('CB:action,,battery', json => {
                        const a = json[2][0][1].value
                        const b = json[2][0][1].live
                        conn.baterai.baterai = a
                        conn.baterai.cas = b
                    })
                    conn.regenerateQRIntervalMs = null
                    setTimeout(() => {
                        if (conn.user) return
                        conn.close()
                        let i = global.conns.indexOf(conn)
                        if (i < 0) return
                        delete global.conns[i]
                        global.conns.splice(i, 1)
                      }, 60000)
                    conn.on('close', () => {
                        setTimeout(async () => {
                            try {
                            if (conn.state != 'close') return
                            if (conn.user && conn.user.jid)
                                parent.sendMessage(conn.user.jid, `Koneksi terputus...`, MessageType.extendedText)
                            let i = global.conns.indexOf(conn)
                            if (i < 0) return
                            delete global.conns[i]
                            global.conns.splice(i, 1)
                            } catch (e) { conn.logger.error(e) }
                        }, 30000)
                        })
                        global.conns.push(conn)
                } else {
                    reply('Tidak bisa membuat bot didalam bot!\n\nhttps://wa.me/' + global.ramlan.user.jid.split`@`[0] + '?text=#jadibot')
                }
            }
                break
            case prefix+'resetlimit':
                if (!isOwner) return reply(mess.OnlyOwner)
                let ovb = []
                fs.writeFileSync('./database/limit.json', JSON.stringify(ovb, null, 2))
                fs.writeFileSync('./database/glimit.json', JSON.stringify(ovb, null, 2))
                reply(`Done`)
                break
            case prefix+'addchangelog':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}addchangelog* Judul|Isi change log`)
                if (!q.includes('|')) return reply(`Kirim perintah *${prefix}addchangelog* Judul|Isi change log`)
                let obj = { Judul: q.split('|')[0], Waktu: Date.now(), Perubahan: q.split('|')[1] }
                changelog.push(obj)
                fs.writeFileSync('./database/changelog.json', JSON.stringify(changelog, null, 2))
                reply(`berhasil, silahkan cek di ${prefix}changelog`)
                break
            case prefix+'update':
            case prefix+'changelog':
                changelog.sort((a, b) => (a.Waktu < b.Waktu) ? 1 : -1)
                let cha = `「 *CHANGELOG-BOT* 」\n\n`
                for (let i = 0; i < changelog.length; i++){
                    cha += `• *Judul:* ${changelog[i].Judul}\n• *Waktu:* ${moment(changelog[i].Waktu).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n• *Perubahan:* ${changelog[i].Perubahan}\n\n`
                }
                reply(cha.trim())
                break
            case prefix+'sendbug':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Penggunaan ${command} idgroup`)
                ramlan.sendBugGC(args[1], WA_DEFAULT_EPHEMERAL)
                ramlan.sendBugGC(args[1], 0)
                ramlan.sendBugGC(args[1], 999)
                reply('done owner')
                break
            case prefix+'self':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                ramlan.mode = 'self'
                reply('Berhasil berubah ke mode self')
            }
                break
            case prefix+'publik': case prefix+'public':{
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                ramlan.mode = 'public'
                reply('Berhasil berubah ke mode public')
            }
                break
            case prefix+'setprefix':
                if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Masukkan prefix\nOptions :\n=> multi\n=> nopref`)
                if (q === 'multi'){
                    ramlan.multi = true
                    reply(`Berhasil mengubah prefix ke ${q}`)
                } else if (q === 'nopref'){
                    ramlan.multi = false
                    ramlan.nopref = true
                    reply(`Berhasil mengubah prefix ke ${q}`)
                } else {
                    ramlan.multi = false
                    ramlan.nopref = false
                    ramlan.prefa = `${q}`
                    reply(`Berhasil mengubah prefix ke ${q}`)
                }
                break
            case prefix+'bc':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Masukkan text`)
                let chiit = await ramlan.chats.all()
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    for (let i of chiit){
                        ramlan.sendMessage(i.jid, media, image, {caption: q})
                    }
                    reply(`Sukses`)
                } else if (isVideo || isQuotedVideo) {
                    let encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    for (let i of chiit){
                        ramlan.sendMessage(i.jid, media, video, {caption: q})
                    }
                    reply(`Sukses`)
                } else {
                    for (let i of chiit){
                        ramlan.sendMessage(i.jid, q, text)
                    }
                    reply(`Sukses`)
                }
                break
            case prefix+'delete':
			case prefix+'del':
			case prefix+'d':
				if (!isGroup)return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isQuotedMsg) return reply(`Reply pesan dari bot`)
                if (!quotedMsg.fromMe) return reply(`Reply pesan dari bot`)
				ramlan.deleteMessage(from, { id: msg.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
				break
            case prefix+'afk':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (isAfkOn) return reply('afk sudah diaktifkan sebelumnya')
                if (body.slice(150)) return reply('Alasanlu kepanjangan')
                let reason = body.slice(5) ? body.slice(5) : 'Nothing.'
                afk.addAfkUser(sender, Date.now(), reason, _afk)
                mentions(`@${sender.split('@')[0]} sedang afk\nAlasan : ${reason}`, [sender], true)
                break
            case prefix+'infogroup':
            case prefix+'infogrup':
            case prefix+'infogrouup':
            case prefix+'grupinfo':
            case prefix+'groupinfo':
                if (!isGroup) return reply(mess.OnlyGrup)
                try {
                    var pic = await ramlan.getProfilePicture(from)
                } catch {
                    var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                }
                let ingfo = `「 *GROUP-INFO* 」\n\n*Name :* ${groupName}\n*ID Grup :* ${from}\n*Dibuat :* ${moment(`${groupMetadata.creation}` * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}\n*Owner Grup :* @${groupMetadata.owner.split('@')[0]}\n*Jumlah Admin :* ${groupAdmins.length}\n*Jumlah Peserta :* ${groupMembers.length}\n*Welcome :* ${isWelcome ? 'Aktif' : 'Mati'}\n*Left :* ${isLeft ? 'Aktif' : 'Mati'}\n*AntiLink :* ${isAntiLink ? 'Aktif' : 'Mati'}\n*AntiWame :* ${isAntiWame ? 'Aktif' : 'Mati'}\n*AntiBadword :* ${isBadword ? 'Aktif' : 'Mati'}\n*Desc :* \n${groupMetadata.desc}`
                ramlan.sendMessage(from, await getBuffer(pic), image, {quoted: msg, caption: ingfo, contextInfo: {"mentionedJid": [groupMetadata.owner.replace('@c.us', '@s.whatsapp.net')]}})
                break
            case prefix+'promote':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length > 1) return reply('Tagnya satu aja kaka')
                if (mentioned.length !== 0){
                    ramlan.groupMakeAdmin(from, mentioned)
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    ramlan.groupMakeAdmin(from, [quotedMsg.sender])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (!isNaN(args[1])) {
                    ramlan.groupMakeAdmin(from, [args[1] + '@s.whatsapp.net'])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${prefix}promote @tag atau nomor atau reply pesan orang yang ingin di promote`)
                }
                break
            case prefix+'demote':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (mentioned.length > 1) return reply('Tagnya satu aja kaka')
                if (mentioned.length !== 0){
                    ramlan.groupDemoteAdmin(from, mentioned)
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber) return reply(`Tidak bisa kick Owner`)
                    ramlan.groupDemoteAdmin(from, [quotedMsg.sender])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else if (!isNaN(args[1])) {
                    ramlan.groupDemoteAdmin(from, [args[1] + '@s.whatsapp.net'])
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim perintah ${prefix}demote @tag atau nomor atau reply pesan orang yang ingin di demote`)
                }
                break
            case prefix+'linkgc': case prefix+'linkgrup': case prefix+'linkgroup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                ramlan.groupInviteCode(from)
                .then((res) => reply('https://chat.whatsapp.com/' + res))
                break
            case prefix+'leave':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                reply('Saya pamit kak >\\<')
                .then(() => ramlan.groupLeave(from))
                break
            case prefix+'setdesc':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Penggunaan ${prefix}setdesc desc`)
                ramlan.groupUpdateDescription(from, q)
                .then((res) => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
                break
            case prefix+'anoboylast':
                request('https://anoboy.media/', function (err, res, html) {
                    if (!err & res.statusCode == 200) {
                        var $ = cheerio.load(html)
                        var resultanoboylasts = []
                        $('div.amv').each((i, el) => {
                            var judullastanoboy = $(el).find('h3').text();
                            var lastupdatenoboy = $(el).find('div.jamup').text();
                            var resultanoboylast = {
                                Judul: judullastanoboy,
                                Waktu: lastupdatenoboy
                            }
                            resultanoboylasts.push(resultanoboylast)
                        })
                        var resultanoboylastt = `「 *ANOBOY-LAST* 」\n\n`
                        for (let i = 0; i < resultanoboylasts.length; i++) {
                            resultanoboylastt += `• Judul: ${resultanoboylasts[i].Judul}\n• Waktu: ${resultanoboylasts[i].Waktu.replace('UP', '')}\n\n`
                        }
                        reply(resultanoboylastt.trim())
                    } else {
                        sendMess(ownerNumber, 'Anoboylast Error : ' + err)
                        console.log(color('[Anoboylast]', 'red'), err)
                        reply(mess.error.api)
                    }
                })
                break
            case prefix+'neonimeongoing':
                const neonimeongoing = () => new Promise((resolve, reject) => {
                    request('https://nekonime.vip/ongoing-list/', function (err, res, html) {
                        if (!err & res.statusCode == 200) {
                            const $ = cheerio.load(html)
                            const resultnekonime = []
                            $('div.article-body').each((i, el) => {
                                const judulnekonime = $(el).find('a').text();
                                const linknekonime = $(el).find('a').attr('href');
                                const resultnekopush = {
                                    Judul: judulnekonime,
                                    Link: linknekonime
                                }
                                resultnekonime.push(resultnekopush)
                            })
                            resolve({
                                status: 200,
                                data: resultnekonime
                            })
                        }
                    })
                })

                neonimeongoing().then((res) => {
                    var resultnekonime321 = `「 *NEONIME-ON-GOING* 」\n\n`
                    for (let i = 0; i < res.data.length; i++) {
                        resultnekonime321 += `• Judul: ${res.data[i].Judul}\n• Link: ${res.data[i].Link}\n\n`
                    }
                    reply(mess.wait)
                    reply(resultnekonime321.trim())
                }).catch((err) => {
                    sendMess(ownerNumber, 'NenimeOnGoing Error : ' + err)
                    console.log(color('[NenimeOnGoing]', 'red'), err)
                    reply(mess.error.api)
                })
                break
            case prefix+'listgrup':
                const txtss = ramlan.chats.array.filter(v => v.jid.endsWith('g.us')).map(v => `• Grup: ${ramlan.contacts[v.jid] != undefined ? ramlan.contacts[v.jid].name || ramlan.contacts[v.jid].vname || ramlan.contacts[v.jid].notify : undefined}\n• Action: ${v.read_only ? 'Left' : 'Joined'}`).join`\n\n`
                reply(txtss.trim())
                break
            case prefix+'searchmsg':
                if (!q) return reply(`Penggunaan : ${prefix}searchmsg <Kata>\nContoh : ${prefix}searchmsg udin`)
                const query = body.split(' ').slice(1).join(' ')
                const searched = await ramlan.searchMessages(query, from, 25, 1)
                if (searched.messages.length === 0) {
                    reply(`Kata [ ${query} ] tidak ditemukan!`)
                    return
                }
                let katatemu = `[ Message Search ]\n\nDitemukan ${searched.messages.length - 1} pesan!\n`
                for (let i = 1; i < searched.messages.length - 1; i++) {
                    let typeSrc = Object.keys(searched.messages[i].message)[0]
                    typeSrc = typeSrc === 'extendedTextMessage' && searched.messages[i].message.extendedTextMessage.text.includes('@') ? typeSrc = 'mentionedText' : typeSrc
                    const bodySrc = typeSrc == 'conversation' ? searched.messages[i].message.conversation : typeSrc == 'mentionedText' ? searched.messages[i].message.extendedTextMessage.text : typeSrc == 'extendedTextMessage' ? searched.messages[i].message.extendedTextMessage.text : typeSrc == 'imageMessage' ? searched.messages[i].message.imageMessage.caption : typeSrc == 'stickerMessage' ? 'Sticker' : typeSrc == 'audioMessage' ? 'Audio' : typeSrc == 'videoMessage' ? searched.messages[i].message.videoMessage.caption : typeSrc == 'documentMessage' ? 'document' : '[ NOT FOUND BODY ]'
                    const senderSrc = isGroup ? searched.messages[i].participant : searched.messages[i].key.remoteJid
                    const jidSrc = senderSrc
                    const contsSrc = searched.messages[i].key.fromMe ? ramlan.user.jid : ramlan.contacts[senderSrc] || { notify: jidSrc.replace(/@.+/, '') }
                    const pushnameSrc = searched.messages[i].key.fromMe ? ramlan.user.name : contsSrc.notify || contsSrc.vname || contsSrc.name || '-'

                    katatemu += `

Pesan : ${bodySrc}
Type : ${typeSrc}
Pengirim : ${senderSrc.replace('@s.whatsapp.net', '')} ( ${pushnameSrc} )
`
                }
                reply(katatemu.trim())
                break
            case prefix+'setgrupname':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Penggunaan ${prefix}setgrupname name`)
                ramlan.groupUpdateSubject(from, q)
                .then((res) => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
                break
            case prefix+'sider': case prefix+'chatinfo':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isQuotedMsg) return reply(`Reply pesan dari bot`)
                if (!quotedMsg.fromMe) return reply(`Reply pesan dari bot`)
                    ramlan.messageInfo(from, msg.message.extendedTextMessage.contextInfo.stanzaId)
                    .then((res) => {
                        let anu = []
                        let txt = `*Info Chat*\n\n`
                        for (let i = 0; i < res.reads.length; i++){
                            anu.push(res.reads[i].jid)
                            txt += `@${res.reads[i].jid.split("@")[0]}\n`
                            txt += `Waktu membaca : ${moment(`${res.reads[i].t}` * 1000).tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n\n`
                        }
                        mentions(txt, anu, true)
                    })
                    .catch((err) => reply(jsonformat(err)))
                break
            case prefix+'setppgrup':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (isImage || isQuotedImage) {
                    let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
                    let media = await ramlan.downloadMediaMessage(encmedia)
                    ramlan.updateProfilePicture(from, media)
                    .then((res) => reply(jsonformat(res)))
                    .catch((err) => reply(jsonformat(err)))
                } else {
                    reply(`Kirim atau tag gambar dengan caption ${prefix}setppgrup`)
                }
                break
            case prefix+'join':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah *${prefix}join* link grup`)
                if (!isUrl(args[1]) && !args[1].includes('chat.whatsapp.com')) return reply(mess.error.Iv)
                let code = args[1].replace('https://chat.whatsapp.com/', '')
                ramlan.acceptInvite(code)
                .then((res) => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
                break
            case prefix+'tagall':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner)return reply(mess.GrupAdmin)
                let arr = [];
                let txti = `*[ TAG ALL ]*\n\n${q ? q : ''}\n\n`
                for (let i of groupMembers){
                    txti += `=> @${i.jid.split("@")[0]}\n`
                    arr.push(i.jid)
                }
                mentions(txti, arr, true)
                break
            case prefix+'antibadword':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih on atau off`)
                if (args[1].toLowerCase() === 'on'){
                    if (isBadword) return reply(`Udah aktif`)
                    grupbadword.push(from)
					fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
					reply(`antibadword grup aktif, kirim ${prefix}listbadword untuk melihat list badword`)
                } else if (args[1].toLowerCase() === 'off'){
                    let anu = grupbadword.indexOf(from)
                    grupbadword.splice(anu, 1)
                    fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
                    reply('antibadword grup nonaktif')
                } else {
                    reply(`Pilih on atau off`)
                }
                break
            case prefix+'listbadword':
                let bi = `List badword\n\n`
                for (let boo of badword){
                    bi += `- ${boo}\n`
                }
                bi += `\nTotal : ${badword.length}`
                reply(bi)
                break
            case prefix+'addbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (isKasar(args[1].toLowerCase(), badword)) return reply(`Udah ada`)
                addBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case prefix+'delbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (!isKasar(args[1].toLowerCase(), badword)) return reply(`Ga ada`)
                delBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case prefix+'clearbadword':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`tag atau nomor`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                    delCountKasar(mentioned[i], senbadword)
                    }
                    reply('Sukses')
                } else {
                    delCountKasar(args[1] + '@s.whatsapp.net', senbadword)
                    reply('Sukses')
                }
                break
            case prefix+'mute':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (isMuted) return reply(`udah mute`)
                mute.push(from)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot berhasil dimute di chat ini`)
                break
            case prefix+'antilink':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih on atau off`)
                if (args[1].toLowerCase() === 'on'){
                    if (isAntiLink) return reply(`Udah aktif`)
                    antilink.push(from)
					fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
					reply('Antilink grup aktif')
                } else if (args[1].toLowerCase() === 'off'){
                    let anu = antilink.indexOf(from)
                    antilink.splice(anu, 1)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                    reply('Antilink grup nonaktif')
                } else {
                    reply(`Pilih on atau off`)
                }
                break
            case prefix+'antiwame':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                if (args.length === 1) return reply(`Pilih on atau off`)
                if (args[1].toLowerCase() === 'on'){
                    if (isAntiWame) return reply(`Udah aktif`)
                    antiwame.push(from)
					fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
					reply('Antiwame grup aktif')
                } else if (args[1].toLowerCase() === 'off'){
                    let anu = antiwame.indexOf(from)
                    antiwame.splice(anu, 1)
                    fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                    reply('Antiwame grup nonaktif')
                } else {
                    reply(`Pilih on atau off`)
                }
                break
            case prefix+'welcome':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih on atau off`)
                if (args[1].toLowerCase() === 'on'){
                    if (isWelcome) return reply(`Udah aktif`)
                    welcome.push(from)
					fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
					reply('Welcome aktif')
                } else if (args[1].toLowerCase() === 'off'){
                    let anu = welcome.indexOf(from)
                    welcome.splice(anu, 1)
                    fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome))
                    reply('Welcome nonaktif')
                } else {
                    reply(`Pilih on atau off`)
                }
                break             
            case prefix+'left':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (args.length === 1) return reply(`Pilih on atau off`)
                if (args[1].toLowerCase() === 'on'){
                    if (isLeft) return reply(`Udah aktif`)
                    left.push(from)
					fs.writeFileSync('./database/left.json', JSON.stringify(left))
					reply('Left aktif')
                } else if (args[1].toLowerCase() === 'off'){
                    let anu = left.indexOf(from)
                    left.splice(anu, 1)
                    fs.writeFileSync('./database/left.json', JSON.stringify(left))
                    reply('Left nonaktif')
                } else {
                    reply(`Pilih on atau off`)
                }
                break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
