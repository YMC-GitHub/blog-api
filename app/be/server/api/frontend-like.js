// ================ frontend-like ================
// this is an api handle for frontend-like
// ================ frontend-like ================
// task:

//connect database
const mongoose = require('../mongoose')
//use data model Article
const Article = mongoose.model('Article')

exports.like = async ctx => {
    // get some msg from query with  the ctx
    const article_id = ctx.query.id
    // get some msg from cookies or header with  the ctx
    const user_id = ctx.cookies.get('userid') || ctx.header['userid']
    try {
        await Article.updateAsync({ _id: article_id }, { $inc: { like: 1 }, $push: { likes: user_id } })
        ctx.success('success', 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}
exports.unlike = async ctx => {
    const article_id = ctx.query.id
    const user_id = ctx.cookies.get('userid') || ctx.header['userid']
    try {
        await Article.updateAsync({ _id: article_id }, { $inc: { like: -1 }, $pull: { likes: user_id } })
        ctx.success('success', 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}
exports.resetLike = async ctx => {
    try {
        const result = await Article.find().exec()
        result.forEach(item => {
            Article.findOneAndUpdateAsync({ _id: item._id }, { like: item.likes.length }, { new: true })
        })
        ctx.success('success', 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}
