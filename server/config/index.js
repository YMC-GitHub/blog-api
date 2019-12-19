//include tool file
const utils = require('../utils')
//create some secret file
utils.creatSecret()
utils.creatMpApp()
//include secret file
const secret = require('./secret.js')
const mpApp = require('./mpapp.js')

//export some config key and value
exports.md5Pre = '!@#$%(*&^)'
exports.secretServer = secret.secretServer
exports.secretClient = secret.secretServer
exports.apiId = mpApp.apiId
exports.secret = mpApp.secret
