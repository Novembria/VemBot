const cheerio = require('cheerio');
const fetch = require('node-fetch');

function searchkomiku(QUERY) { 
     return new Promise((resolve, reject) => { 
          fetch('https://komiku.id/cari/?post_type=manga&s='+ encodeURIComponent(QUERY) , { 
              method: 'get',
              headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9,id;q=0.8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
            } 
            }) 
          .then(res => res.text()) 
          .then(res => { 
               const soup = cheerio.load(res) 
               const IndTitle = [];
               const keterangan = []; 
               const thumb = []; 
               const link = [];
               const hasil = []; 
               soup('div.daftar').each(function(a, b) { 
                    soup(b).find('span.judul2').each(function(c, d) { 
                         IndTitle.push(soup(d).text()) 
                    }) 
                    soup(b).find('p').each(function(c, d) { 
                         keterangan.push(soup(d).text().trim()) 
                    }) 
                    soup('div.bgei').each(function(c, d) { 
                         soup(d).find('a').each(function(e, f) { 
                            link.push("https://data1.komiku.id" + soup(f).attr('href')) 
                              soup(f).find('img').each(function(g, h) { 
                                   thumb.push(soup(h).attr('data-src')) 
                              }) 
                         }) 
                    }) 
               }) 
               for (let i = 0; i < IndTitle.length; i++) { 
                    hasil.push({ Judul: IndTitle[i], Gambar: thumb[i], Keterangan: keterangan[i], Link: link[i] }) 
               } 
               resolve(hasil) 
          }) 
          .catch(reject) 
     }) 
}
function komiku(link) { 
    return new Promise(async (resolve, reject) => {
         fetch(link , { 
            method: 'get',
            headers: {
              "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-language": "en-US,en;q=0.9,id;q=0.8",
              "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
          } 
          }) 
         .then(res => res.text()) 
         .then(res => { 
          const soup = cheerio.load(res)
          let JudulJepang = soup('header#Judul > h1[itemprop="name"]').text().trim()
          let JudulIndo = soup('header#Judul > p[class="j2"]').text().trim()
          let Description = soup('header#Judul > p[itemprop="description"]').text().trim()
          let Chapter = soup('div.new1.sd.rd > a > span').text().trim()
          let thumb = soup('section#Informasi > div[class="ims"] > img').attr('src')
          let creator = soup('section#Informasi > table.inftable > tbody > tr > td[itemprop="creator"]').text().trim()
          let genre = soup('ul.genre > li.genre').text()
          let sinopsis = soup('section#Sinopsis.sec > p').text().trim()
          let hasil = ({ 
               JudulJepang: JudulJepang, 
               JudulIndo: JudulIndo, 
               Deskripsi: Description, 
               Chapter: Chapter,
               Thumbnail: thumb,
               Creator: creator,
               Genre: genre,
               Link: link,
               Sinopsis: sinopsis.replace(/[\t]/gi, '')
          })
          resolve(hasil) 
         }) 
         .catch(reject) 
    }) 
}

module.exports.searchkomiku = searchkomiku
module.exports.komiku = komiku