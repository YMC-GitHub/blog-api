//include promoisify lib
const Promise = require('bluebird')
// connetc datdbase
const mongoose = require('../mongoose')
// design data model Comment
const Schema = mongoose.Schema
const CommentSchema = new Schema({
    article_id: String,
    userid: String,
    username: String,
    email: String,
    avatar: String,
    content: String,
    creat_date: String,
    is_delete: Number,
    timestamp: Number,
})
const Comment = mongoose.model('Comment', CommentSchema)
//make the model Comment promoisify
Promise.promisifyAll(Comment)
Promise.promisifyAll(Comment.prototype)
//export the model Comment
module.exports = Comment
