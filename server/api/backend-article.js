// ================ backend-article ================
// this is an api handle for backend-article
// ================ backend-article ================
// task:
// curd backend-article article
// make markdown to html with marked lib

//connect database
const mongoose = require('../mongoose')
//use data model Category,Article
const Article = mongoose.model('Article')
const Category = mongoose.model('Category')
//include some commom function for api
const general = require('./general')
const { list, item } = general

const moment = require('moment')
const marked = require('marked')
const hljs = require('highlight.js')
marked.setOptions({
    highlight(code) {
        return hljs.highlightAuto(code).value
    },
    breaks: true,
})

/**
 * R-get article list
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.getList = async ctx => {
    await list(ctx, Article, '-update_date')
}

/**
 * R-get an article
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.getItem = async ctx => {
    await item(ctx, Article)
}

/**
 * C-create an article
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.insert = async ctx => {
    const { category, content, title } = ctx.request.body
    // make markdown to html with marked lib
    const html = marked(content)
    const arr_category = category.split('|')
    const data = {
        title,
        category: arr_category[0],
        category_name: arr_category[1],
        content,
        html,
        visit: 0,
        like: 0,
        comment_count: 0,
        creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X'),
    }
    try {
        // create data to database with data model Article
        const result = await Article.createAsync(data)
        // update data to database with data model Category
        await Category.updateAsync({ _id: arr_category[0] }, { $inc: { cate_num: 1 } })
        ctx.success(result, 'create success')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * D-delete article
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.deletes = async ctx => {
    const _id = ctx.query.id
    try {
        await Article.updateAsync({ _id }, { is_delete: 1 })
        await Category.updateAsync({ _id }, { $inc: { cate_num: -1 } })
        ctx.success('success', 'delete success')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * U-recover article
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.recover = async ctx => {
    const _id = ctx.query.id
    try {
        await Article.updateAsync({ _id }, { is_delete: 0 })
        await Category.updateAsync({ _id }, { $inc: { cate_num: 1 } })
        ctx.success('success', 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * U-update article
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.modify = async ctx => {
    const { id, title, category, category_name, category_old, content } = ctx.request.body
    const html = marked(content)
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    try {
        const result = await Article.findOneAndUpdateAsync(
            { _id: id },
            { category, category_name, content, html, title, update_date },
            { new: true }
        )
        if (category !== category_old) {
            await Promise.all([
                Category.updateAsync({ _id: category }, { $inc: { cate_num: 1 } }),
                Category.updateAsync({ _id: category_old }, { $inc: { cate_num: -1 } }),
            ])
        }
        ctx.success(result, 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}
