// ================ Article ================
// this is data model Article
// ================ Article ================

//include promoisify lib
const Promise = require('bluebird')
// connetc datdbase
const mongoose = require('../mongoose')
// design data model Article
const Schema = mongoose.Schema
const ArticleSchema = new Schema({
    title: String,
    content: String,
    html: String,
    category: String,
    category_name: String,
    visit: Number,
    like: Number,
    comment_count: Number,
    creat_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number,
    likes: [String],
})
const Article = mongoose.model('Article', ArticleSchema)
//make the model Article promoisify
Promise.promisifyAll(Article)
Promise.promisifyAll(Article.prototype)
//export the model Article
module.exports = Article
