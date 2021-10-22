const { default:Axios } = require("axios");
const cheerio = require("cheerio");

function getEmoji(emoji){
    return new Promise((resolve, reject) => {
        const emo = encodeURIComponent(emoji)
        Axios.get(`https://emojipedia.org/${emo}/`)
        .then(({data}) => {
            const $ = cheerio.load(data)
            const Array = []
            let json = {}
            $('section.vendor-list > ul > li').each(function(a, b) {
                const nama = $(b).find('div.vendor-info > h2 > a').text()
                const url = $(b).find('div.vendor-image > img').attr('src')
                Array.push({
                    nama,
                    url
                })
            })
            Array.map(v => {
                if (v.nama === undefined) return
                if (v.url === undefined) return
                json[v.nama.toLowerCase()] = v.url
            })
            resolve({
                code: 200,
                creator: 'aqulzz',
                result: json
            })
        })
        .catch(reject)
    })
}

//getEmoji('🐦')
//.then(console.log)
//.catch(console.log)

module.exports.getEmoji = getEmoji