exports.menu = (ucapan, prefix, pendaftar, runtime, pushname, isOwner, isPremium, sisalimit, limitCount, glimit, gcount, expired, tanggal, jam, i, mode) => {
    return `${ucapan.data.result}, ${pushname}

_“Penemuan terbesar sepanjang masa adalah bahwa seseorang bisa mengubah masa depannya hanya dengan mengubah sikapnya saat ini.”_

🧍 *Creator :* Novem
🗄️ *Lib:* Stable
🤖 *Bot Name* : Vem Bot
🗄️ *Mode:* ${mode.toUpperCase()}
📍 *Prefix:*〔 ${prefix} 〕
👤 *Total Users:* 5${pendaftar.length}
📝 *Date:* ${tanggal}
⏰ *Time:* ${jam}
⏳ *Runtime:* ${runtime}

 *USER INFO*
👤 *Name:* ${pushname}
📍 *Status:* ${isOwner ? 'OWNER' : isPremium ? 'Premium' : 'Gratisan'}
⏳ *Limit:* ${isPremium ? 'Unlimited' : `${sisalimit}/${limitCount}`}
⏳ *Limit Game:* ${isOwner ? 'Unlimited' : `${glimit}/${gcount}`}
📝 *Expired Prem:* ${isOwner ? 'Unlimited' : isPremium ? expired : 'Not Premium'}

📝 *INFO*
 cekprefix
 ${prefix}listgrup
 ${prefix}update
 ${prefix}stats
 ${prefix}snk
 ${prefix}rules
 ${prefix}donasi
 ${prefix}limit
 ${prefix}balance
 ${prefix}runtime
 ${prefix}ping
 ${prefix}owner
 ${prefix}info

📝 *GABUT MENU*
 ${prefix}cantik
 ${prefix}ganteng
 ${prefix}jadian
 ${prefix}darkjokes
 ${prefix}heroml
 ${prefix}topglobal
 ${prefix}toplocal

📝 *MULTI SESSION*
 ${prefix}jadibot
 ${prefix}stopjadibot
 ${prefix}getcode
 ${prefix}listbot

📝 *STICKER*
 ${prefix}sticker
 ${prefix}swm
 ${prefix}take
 ${prefix}toimg
 ${prefix}attp
 ${prefix}ttp
 ${prefix}tts
 ${prefix}trigger
 ${prefix}cs
 ${prefix}sjail
 ${prefix}strash
 ${prefix}sgreyscale
 ${prefix}sblur
 ${prefix}sinvert
 ${prefix}sticksepia
 ${prefix}sthreshold
 ${prefix}scolorfy
 ${prefix}stickshit
 ${prefix}swanted
 ${prefix}swasted
 ${prefix}shitler
 ${prefix}stickrip
 ${prefix}stickgay

📝 *CANVASMENU*
 ${prefix}circle
 ${prefix}grayscale
 ${prefix}jail
 ${prefix}pixel
 ${prefix}blur
 ${prefix}invert
 ${prefix}sepia
 ${prefix}threshold
 ${prefix}colorfy
 ${prefix}shit
 ${prefix}wasted
 ${prefix}wanted
 ${prefix}affect
 ${prefix}jokeoverhead
 ${prefix}hitler
 ${prefix}trash
 ${prefix}rip
 ${prefix}gay
 ${prefix}facepalm
 ${prefix}beautiful
 ${prefix}ytcomment
 ${prefix}phcomment

📝 *PHOTOOXYMENU*
 ${prefix}shadow
 ${prefix}cup
 ${prefix}cup1
 ${prefix}romance
 ${prefix}smoke
 ${prefix}burnpaper
 ${prefix}lovemassage
 ${prefix}undergras
 ${prefix}love
 ${prefix}coffe
 ${prefix}woodheart
 ${prefix}woodenboard
 ${prefix}summer3d
 ${prefix}wolfmetal
 ${prefix}nature3d
 ${prefix}underwater
 ${prefix}golderrose
 ${prefix}summernature
 ${prefix}letterleaves
 ${prefix}glowingneon
 ${prefix}fallleaves
 ${prefix}flamming
 ${prefix}harrypotter
 ${prefix}carvedwood
 ${prefix}arcade8bit
 ${prefix}battlefield4
 ${prefix}pubg

📝 *NULIS MENU*
 ${prefix}nuliskiri
 ${prefix}nuliskanan
 ${prefix}foliokiri
 ${prefix}foliokanan

📝 *MAKER MENU*
 ${prefix}hartatahta *query*
 ${prefix}neon
 ${prefix}matrix
 ${prefix}blackpink
 ${prefix}halloween
 ${prefix}thundername
 ${prefix}devilwings
 ${prefix}cloudtext
 ${prefix}bloodtext
 ${prefix}greenneon
 ${prefix}advenceglow
 ${prefix}futureneon
 ${prefix}neonlight
 ${prefix}text1917
 ${prefix}minion
 ${prefix}holographic
 ${prefix}dulexesilver
 ${prefix}newyearcard
 ${prefix}bloodfrosted
 ${prefix}halloween
 ${prefix}fireworksparkle
 ${prefix}natureleaves
 ${prefix}bokeh
 ${prefix}toxic
 ${prefix}strawberry
 ${prefix}box3d
 ${prefix}roadwarning
 ${prefix}breakwall
 ${prefix}icecold
 ${prefix}luxury
 ${prefix}cloud
 ${prefix}summersand
 ${prefix}horrorblood
 ${prefix}thunder
 ${prefix}pornhub
 ${prefix}avenger
 ${prefix}space
 ${prefix}marvelstudio
 ${prefix}lionlogo
 ${prefix}steel3d
 ${prefix}wallgravity
 ${prefix}bloodtext2
 ${prefix}steeltext
 ${prefix}lavatext
 ${prefix}toxiclogo
 ${prefix}dropwater
 ${prefix}metaldark
 ${prefix}sandwrite
 ${prefix}3dwater
 ${prefix}graffiti
 ${prefix}graffiti2
 ${prefix}phlogo
 ${prefix}glitch
 ${prefix}graffiti3
 ${prefix}layeredtext
 ${prefix}vintage
 ${prefix}3dspace
 ${prefix}stonetext
 ${prefix}avengers
 ${prefix}marvellogo
 ${prefix}lionlogo
 ${prefix}3dmetal
 ${prefix}wolflogo
 ${prefix}ninjalogo
 ${prefix}shadowtext
 ${prefix}smoketext
 ${prefix}romancetext
 ${prefix}carvedwood
 ${prefix}harrypotter
 ${prefix}flamingtext
 ${prefix}falleaves
 ${prefix}underwater
 ${prefix}wolfmetal
 ${prefix}undergrass
 ${prefix}coffetext
 ${prefix}woodboard
 ${prefix}undergrass
 ${prefix}coffetext
 ${prefix}lovetext
 ${prefix}burnpaper
 ${prefix}lovemessage

📝 *SERTIFIKAT MENU*
 ${prefix}tololserti
 ${prefix}fuckboy
 ${prefix}fuckgirl
 ${prefix}bucinserti
 ${prefix}goodboy
 ${prefix}goodgirl
 ${prefix}badboy
 ${prefix}badgirl

📝 *DOWNLOADER*
 ${prefix}twtdl *url*
 ${prefix}ytmp4 *url*
 ${prefix}ytmp3 *url*
 ${prefix}igdl *url*
 ${prefix}tiktok *url*
 ${prefix}fbdl *url*
 ${prefix}yts *query*
 ${prefix}play *query*
 ${prefix}playmp4 *query*

📝 *ANIME*
 ${prefix}dewabatch *query*
 ${prefix}manga *query*
 ${prefix}kemono
 ${prefix}otakulast
 ${prefix}shota
 ${prefix}neonimeongoing
 ${prefix}anoboylast
 ${prefix}waifu
 ${prefix}nekonime
 ${prefix}loli
 ${prefix}husbu
 ${prefix}shinobu
 ${prefix}megumin
 ${prefix}konachan *query*

📝 *MEDIA*
 ${prefix}ghstalk *username*
 ${prefix}asupan
 ${prefix}fakedata
 ${prefix}githubsearch *query*
 ${prefix}ramalpasangan kamu|dia
 ${prefix}grupsearch *query*
 ${prefix}kodepost *daerah*
 ${prefix}appstore *query*
 ${prefix}bing *query*
 ${prefix}artimimpi *query*
 ${prefix}brainly *question*
 ${prefix}newstickerline
 ${prefix}growstock *query*
 ${prefix}happymod *query*
 ${prefix}drakor *query*
 ${prefix}amazon *query*
 ${prefix}nomorhoki *nohp*
 ${prefix}artinama *nama*
 ${prefix}googleimage *query*
 ${prefix}cuaca *daerah*
 ${prefix}heroml *query*
 ${prefix}wattpad *query*
 ${prefix}cekspek *query*
 ${prefix}pinterest *query*
 ${prefix}npmjs *query*
 ${prefix}nuliskiri *text*
 ${prefix}nuliskanan *text*
 ${prefix}foliokiri *text*
 ${prefix}foliokanan *text*

📝 *TOOLS*
 ${prefix}readmore a|b
 ${prefix}ebase64 *text*
 ${prefix}debase64 *enc-base64*
 ${prefix}ehex *text*
 ${prefix}dehex *enc-hex*
 ${prefix}ebinary *text*
 ${prefix}debinary *enc-binary*
 ${prefix}dork *dork?*
 ${prefix}ipgeolocation *ip*
 ${prefix}tinyurl *url*
 ${prefix}translate

📝 *BAILEYS*
 ${prefix}setcmd *${prefix}any?*
 ${prefix}delcmd
 ${prefix}listcmd
 ${prefix}inspect *url*
 ${prefix}searchmsg *query*
 ${prefix}tagme
 ${prefix}kontak nomor|nama
 ${prefix}hidetag
 ${prefix}getpp @tag atau 'group'

📝 *SEWA*
 ${prefix}sewa
 ${prefix}sewa batal
 ${prefix}addsewa link waktu
 ${prefix}delsewa idgroup

📝 *PREMIUM*
 ${prefix}premium
 ${prefix}premium batal
 ${prefix}addprem @tag waktu
 ${prefix}delprem @tag
 ${prefix}cekprem
 ${prefix}listprem

📝 *BANNED*
 ${prefix}ban @tag
 ${prefix}unban @tag
 ${prefix}listban

📝 *GAME*
 ${prefix}buylimit *jumlah*
 ${prefix}buyglimit *jumlah*
 ${prefix}tictactoe *@tag*
 ${prefix}delttt
 ${prefix}tebakgambar
 ${prefix}family100
 ${prefix}suit
       
📝 *GROUP*
 ${prefix}revokelink
 ${prefix}afk
 ${prefix}infogrup
 ${prefix}chatinfo
 ${prefix}promote *@tag*
 ${prefix}demote *@tag*
 ${prefix}linkgc
 ${prefix}leave
 ${prefix}setdesc
 ${prefix}setgrupname
 ${prefix}setppgrup
 ${prefix}opengrup
 ${prefix}closegrup
 ${prefix}tagall
 ${prefix}mute
 ${prefix}unmute

📝 *SYSTEM*
 ${prefix}antilink *on|off*
 ${prefix}antiwame *on|off*
 ${prefix}welcome *on|off*
 ${prefix}left *on|off*
 ${prefix}antibadword *on|off*
 ${prefix}listbadword
 ${prefix}addbadword *any*
 ${prefix}delbadword *any*

 *OWNER*
 >
 $
 ${prefix}join
 ${prefix}self
 ${prefix}public
 ${prefix}setprefix
 ${prefix}bc
 ${prefix}sendbug
 ${prefix}antidelete
 ${prefix}clearall
 ${prefix}addchagelog
 ${prefix}setpp
 ${prefix}setname
 ${prefix}setbio
 ${prefix}exif nama|author

 *THANKS TO*
 Allah SWT
 Ortu
 Novem
 Hizkia ID
 Ramlan ID
 MrG3P5
 Aqulzz
 And All creator bot
 _Since © 2021_
`
}
