// ================ User ================
// this is data model User
// ================ User ================

//include promoisify lib
const Promise = require('bluebird')
// connetc datdbase
const mongoose = require('../mongoose')
// design data model User
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    creat_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number,
    wx_avatar: String,
    wx_signature: String,
})
const User = mongoose.model('User', UserSchema)
//make the model User promoisify
Promise.promisifyAll(User)
Promise.promisifyAll(User.prototype)
//export the model User
module.exports = User
