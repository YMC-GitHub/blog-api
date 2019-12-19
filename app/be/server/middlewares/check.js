// ================ check ================
// this is a custom koa middleware check
// ================ check ================
// task:
// verify the token with some config


//include token lib
const jwt = require('jsonwebtoken')
//include some config
const config = require('../config')

//export a function to verify token
module.exports = (token, type) => {
    // eslint-disable-next-line
    const secret = type === 'admin' ? config.secretServer : config.secretClient
    return new Promise(resolve => {
        //verify the token with some config
        jwt.verify(token, secret, function (err, decoded) {
            resolve(decoded)
        })
    })
}
