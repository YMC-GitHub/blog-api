// ================ backend-user ================
// this is an api handle for backend-user
// ================ backend-user ================
// task:
// curd backend-user admin
// sign username to token with jwt lib and some config
// encode password with md5 lib and some config
// encode username to base64 format
// bind some msg on cookies for the ctx

const md5 = require('md5')
const fs = require('fs')
const moment = require('moment')
const jwt = require('jsonwebtoken')

//connect database
const mongoose = require('../mongoose')
//use data model Admin
const Admin = mongoose.model('Admin')

const fsExistsSync = require('../utils').fsExistsSync
const config = require('../config')
const md5Pre = config.md5Pre
const secret = config.secretServer
//include some commom function for api
const general = require('./general')
const { list, item, modify, deletes, recover } = general

/**
 * R-get admin list
 * @method getList
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.getList = async ctx => {
    await list(ctx, Admin)
}

/**
 * R-get an admin
 * @method getItem
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.getItem = async ctx => {
    await item(ctx, Admin)
}

/**
 * R-admin login
 * @method loginAdmin
 * @param  {[type]} ctx [description]
 * @return {[type]}       [description]
 */
exports.login = async ctx => {
    // get some msg from request with ctx
    const { password, username } = ctx.request.body
    if (username === '' || password === '') {
        ctx.error('please input user name and password')
        return
    }
    try {
        // get data from database with data model Admin
        const result = await Admin.findOneAsync({
            username,
            //encode password with md5 lib and some config
            password: md5(md5Pre + password),
            is_delete: 0,
        })
        if (result) {
            const id = result._id
            const remember_me = 2592000000
            const _username = encodeURI(username)
            //sign username to token with jwt lib and some config
            const token = jwt.sign({ id, username: _username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
            //bind some msg on cookies for the ctx
            ctx.cookies.set('b_user', token, { maxAge: remember_me, httpOnly: false })
            ctx.cookies.set('b_userid', id, { maxAge: remember_me })
            //encode username to base64 format
            ctx.cookies.set('b_username', new Buffer(_username).toString('base64'), { maxAge: remember_me })
            ctx.success(token, 'login success')
        } else {
            ctx.error('user name or password error')
        }
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * C-create admin when initing
 * @method insertAdmin
 * @param  {[type]}    ctx  [description]
 * @param  {[type]}    next  [description]
 * @return {json}         [description]
 */
exports.insert = async ctx => {
    const { email, password, username } = ctx.request.body
    const payload = {}
    if (fsExistsSync('./admin.lock')) {
        payload.message = 'please delete admin.lock first'
    } else if (!username || !password || !email) {
        payload.message = 'please fill on form first'
    } else {
        try {
            const result = await Admin.findOneAsync({ username })
            if (result) {
                payload.message = 'the admin has been created'
            } else {
                // create data to database with data model Admin
                await Admin.createAsync({
                    username,
                    password: md5(md5Pre + password),
                    email,
                    creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    is_delete: 0,
                    timestamp: moment().format('X'),
                })
                await fs.writeFileSync('./admin.lock', username)
                payload.message = ' crreate admin success: ' + username + ', password: ' + password
            }
        } catch (err) {
            payload.message = err.toString()
        }
    }
    //todos:return json
    //so:
    //add await ctx.error(payload.message) when err
    //add await ctx.success(payload.message) when success
    await ctx.render('admin-add', payload)
}

/**
 * U-update admin
 * @method modifyAdmin
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.modify = async ctx => {
    const { id, email, password, username } = ctx.request.body
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const data = { email, username, update_date }
    if (password) data.password = md5(md5Pre + password)
    // update data to database with data model Admin
    await modify(ctx, Admin, id, data)
}

/**
 * D-delete admin
 * @method deletes
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.deletes = async ctx => {
    // delete data to database with data model Admin
    await deletes(ctx, Admin)
}

/**
 * U-recover admin
 * @method recover
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.recover = async ctx => {
    // update data to database with data model Admin
    await recover(ctx, Admin)
}
