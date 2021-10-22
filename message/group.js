"use strict";
const {
	MessageType,
	Presence
} = require("@adiwajshing/baileys");
const fs = require("fs");
const canvas = require("discord-canvas");

const { getBuffer, sleep } = require("../lib/myfunc");

let setting = JSON.parse(fs.readFileSync('./config.json'));
let { botName } = setting

module.exports = async(ramlan, anj, welcome, left) => {
    const isWelcome = welcome.includes(anj.jid)
    const isLeft = left.includes(anj.jid)
    const mdata = await ramlan.groupMetadata(anj.jid)
    const groupName = mdata.subject
    const conts = ramlan.contacts[anj.participants[0]] || { notify: jid.replace(/@.+/, '') }
	const pushname = conts.notify || conts.vname || conts.name || '-'

    if (anj.action === 'add'){
        if (anj.participants[0] === ramlan.user.jid){
            await sleep(5000)
            ramlan.updatePresence(anj.jid, Presence.composing)
            ramlan.sendMessage(anj.jid, `Welcome  @${anj.participants[0].split("@")[0]}`, MessageType.text, {contextInfo: { mentionedJid: [anj.participants[0]]}})
        } else if (isWelcome){
            try {
                var pic = await ramlan.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            const welcomer = await new canvas.Welcome()
                .setUsername(pushname)
                .setDiscriminator(anj.participants[0].substring(6, 10))
                .setMemberCount(mdata.participants.length)
                .setGuildName(groupName)
                .setAvatar(pic)
                .setColor('border', '#00100C')
                .setColor('username-box', '#00100C')
                .setColor('discriminator-box', '#00100C')
                .setColor('message-box', '#00100C')
                .setColor('title', '#00FFFF')
                //.setBackground('https://i.ibb.co/gwT1HxL/308f40b82bfa.jpg')
                .setBackground('https://images5.alphacoders.com/994/994406.jpg')
                .toAttachment()
            ramlan.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `
Welcome  @${anj.participants[0].split("@")[0]} `, contextInfo: {"mentionedJid": [anj.participants[0]]}})
        }
    } else if (anj.action === 'remove' && isLeft){
        try {
            var pic = await ramlan.getProfilePicture(anj.participants[0])
        } catch {
            var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
        }
        const bye = await new canvas.Goodbye()
            .setUsername(pushname)
            .setDiscriminator(anj.participants[0].substring(6, 10))
            .setMemberCount(mdata.participants.length)
            .setGuildName(groupName)
            .setAvatar(pic)
            .setColor('border', '#00100C')
            .setColor('username-box', '#00100C')
            .setColor('discriminator-box', '#00100C')
            .setColor('message-box', '#00100C')
            .setColor('title', '#00FFFF')
            .setBackground('https://images5.alphacoders.com/994/994406.jpg')
            .toAttachment()
        ramlan.sendMessage(anj.jid, bye.toBuffer(), MessageType.image, {caption: `Sayonara  @${anj.participants[0].split("@")[0]}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
    }
}
