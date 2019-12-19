// ================ Category ================
// this is data model Category
// ================ Category ================

//include promoisify lib
const Promise = require('bluebird')
// connetc datdbase
const mongoose = require('../mongoose')
// design data model Category
const Schema = mongoose.Schema
const CategorySchema = new Schema({
    cate_name: String,
    cate_order: String,
    cate_num: Number,
    creat_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number,
})
const Category = mongoose.model('Category', CategorySchema)
//make the model Category promoisify
Promise.promisifyAll(Category)
Promise.promisifyAll(Category.prototype)
//export the model Category
module.exports = Category
