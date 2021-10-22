const { default: Axios } = require('axios')
let setting = JSON.parse(require('fs').readFileSync('./config.json'))

function getAuth() {
     return new Promise((resolve, reject) => {
          Axios({
               method: 'POST',
               url: 'https://api.saweria.co/auth/login',
               headers: {
                    'content-type': 'application/json'
               },
               data: {
                    email: setting.saweria.email,
                    password: setting.saweria.password
               }
          })
               .then((data) => {
                    setting.saweria['user-id'] = data.data.data.id
                    require('fs').writeFileSync('./config.json', JSON.stringify(setting, null, 5))
                    resolve({ status: true, auth: data.headers.authorization, result: data.data })
               })
               .catch(e => reject({ status: false, message: e.message }))
     })
}

function checkPay(id) {
     return new Promise((resolve, reject) => {
          getAuth()
               .then(myauth => {
                    // console.log(myauth);
                    Axios.get('https://api.saweria.co/donations/replay/' + id, {
                         headers: {
                              'authorization': myauth.auth,
                              'origin': 'https://saweria.co',
                              'referer': 'https://saweria.co/'
                         }
                    }).then(({ data }) => {
                         resolve(data)
                    })
                         .catch(({ response }) => {
                              reject(response.data)
                         })
               })
               .catch(console.log)
     })
}


function requestPay(name, phone, amount, email, message = 'pay auto', payment = 'ovo' | 'gopay' | 'dana' | 'linkaja' | 'qris') {
     return new Promise((resolve, reject) => {
          if (typeof amount === 'string') return reject({ status: false, message: 'Amount is not a number!' })
          let pembayaran = payment == 'ovo' ? amount + amount * 7 / 100 : amount + amount * 6 / 100
          let dataPost = {
               agree: true,
               message: message,
               amount: pembayaran,
               payment_type: payment,
               vote: "",
               customer_info: {
                    first_name: name,
                    email: email,
                    phone: phone
               }
          }
          Axios({
               method: 'POST',
               url: 'https://api.saweria.co/donations/' + setting.saweria['user-id'],
               headers: {
                    'Content-Type': 'application/json'
               },
               data: dataPost
          }).then(({ data }) => {
               resolve(data)
          }).catch(({ response }) => {
               reject(response.data)
          })
     })
}

module.exports = { checkPay, requestPay }
