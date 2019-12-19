// ================ Admin ================
// this is data model Admin
// ================ Admin ================

//include promoisify lib
const Promise = require('bluebird')
// connetc datdbase
const mongoose = require('../mongoose')
// design data model Admin
const Schema = mongoose.Schema
const AdminSchema = new Schema({
    username: String,
    email: String,
    password: String,
    creat_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number,
})
const Admin = mongoose.model('Admin', AdminSchema)
//make the model Admin promoisify
Promise.promisifyAll(Admin)
Promise.promisifyAll(Admin.prototype)
//export the model Admin
module.exports = Admin
