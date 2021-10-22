const mysql = require('mysql')
const connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'db_premium'
})

function tambahPremium(id, expired) {
     return new Promise((resolve, reject) => {
          connection.connect()
          connection.query('SELECT * FROM users', (e, result, f) => {
               if (e) {
                    reject({ status: false, message: e })
                    connection.end()
                    return
               }
               let jidList = result.map(arr => arr.id)
               if (jidList.includes(id)) {
                    reject({ status: false, message: 'Maaf ID tersebut sudah ada di database!' })
                    connection.end()
                    return
               }
               connection.query(`INSERT INTO users(id,expired) VALUES('${id}','${expired}')`, (e) => {
                    if (e) {
                         reject({ status: false, message: e })
                         connection.end()
                         return
                    }
                    resolve({ status: true, message: `Berhasil memasukan data ${id}!` })
                    connection.end()
               })
          })
     })
}

function deletePremium(id) {
     return new Promise((resolve, reject) => {
          connection.connect()
          connection.query('SELECT * FROM users', (e, result, f) => {
               if (e) {
                    reject({ status: false, message: e })
                    connection.end()
                    return
               }
               let jidList = result.findIndex(i => i.id == id)
               if (jidList == -1) {
                    reject({ status: false, message: 'Maaf ID tersebut tidak ada di database!' })
                    connection.end()
                    return
               }
               connection.query(`DELETE FROM users WHERE id='${id}'`, (e) => {
                    if (e) {
                         reject({ status: false, message: e })
                         connection.end()
                         return
                    }
                    resolve({ status: true, message: `Berhasil hapus data ${id}!` })
                    connection.end()
               })
          })
     })
}


function editPremium(id, newExpired) {
     return new Promise((resolve, reject) => {
          connection.connect()
          connection.query('SELECT * FROM users', (e, result, f) => {
               if (e) {
                    reject({ status: false, message: e })
                    connection.end()
                    return
               }
               let jidList = result.findIndex(i => i.id == id)
               if (jidList == -1) {
                    reject({ status: false, message: 'Maaf ID tersebut tidak ada di database!' })
                    connection.end()
                    return
               }
               connection.query(`UPDATE users SET expired='${newExpired}' WHERE id='${id}'`, (e) => {
                    if (e) {
                         reject({ status: false, message: e })
                         connection.end()
                         return
                    }
                    resolve({ status: true, message: `Berhasil edit data ${id} dengan expired ${newExpired}!` })
                    connection.end()
               })
          })
     })
}

function listPremium() {
     return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM users', (e, r, f) => {
               if (e) {
                    reject({ status: false, message: e })
               } else {
                    resolve({ status: true, result: r })
               }
               connection.end()
          })
     })
}

// editPremium('6281325282528@s.whatsapp.net', '1717017605252')
// deletePremium('21asd')
listPremium()
//tambahPremium('21asd', '123sadd')
.then(data => console.log(data))
.catch(e => console.log(e))