// ================ backend-category ================
// this is an api handle for backend-category
// ================ backend-category ================
// task:
// curd backend-category category

const moment = require('moment')
//connect database
const mongoose = require('../mongoose')
//use data model Category
const Category = mongoose.model('Category')
//include some commom function for api
const general = require('./general')
const { list, item, modify, deletes, recover } = general

/**
 * R-get category list
 * @method
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.getList = async ctx => {
    try {
        // get data from database with data model Category
        const result = await Category.find()
            .sort('-cate_order')
            .exec()
        ctx.success({
            list: result,
        })
    } catch (err) {
        ctx.error(err.toString())
    }
}

exports.getItem = async ctx => {
    await item(ctx, Category)
}

exports.insert = async ctx => {
    const { cate_name, cate_order } = ctx.request.body
    if (!cate_name || !cate_order) {
        ctx.error('please fill on category name and order')
    } else {
        try {
            // create data to database with data model Category
            const result = await Category.createAsync({
                cate_name,
                cate_order,
                creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                timestamp: moment().format('X'),
            })
            ctx.success(result._id, 'create success')
        } catch (err) {
            ctx.error(err.toString())
        }
    }
}

exports.deletes = async ctx => {
    await deletes(ctx, Category)
}

exports.recover = async ctx => {
    await recover(ctx, Category)
}

exports.modify = async ctx => {
    const { id, cate_name, cate_order } = ctx.request.body
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    await modify(ctx, Category, id, { cate_name, cate_order, update_date })
}
