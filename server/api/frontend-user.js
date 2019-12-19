// ================ frontend-user ================
// this is an api handle for frontend-user
// ================ frontend-user ================
// task:

//connect database
const mongoose = require('../mongoose')
//use data model User
const User = mongoose.model('User')
//include some commom function for api
const general = require('./general')
const { list, modify, deletes, recover } = general

const md5 = require('md5')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require('../config')
const md5Pre = config.md5Pre
const secret = config.secretClient
const mpappApiId = config.apiId
const mpappSecret = config.secret
const strlen = require('../utils').strlen


exports.getList = async ctx => {
    await list(ctx, User)
}

/**
 * R-user login
 * @method login
 * @param  {[type]}   ctx [description]
 * @return {[type]}       [description]
 */
exports.login = async ctx => {
    const { username, password } = ctx.request.body
    if (username === '' || password === '') {
        ctx.error('please input user name and password')
    }
    try {
        // get data from database with data model User
        // encode password with md5 lib and some config
        const result = await User.findOneAsync({ username, password: md5(md5Pre + password), is_delete: 0 })
        if (result) {
            const id = result._id
            const remember_me = 2592000000
            const _username = encodeURI(username)
            //sign username to token with jwt lib and some config
            const token = jwt.sign({ id, username: _username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
            //bind some msg on cookies for the ctx
            ctx.cookies.set('user', token, { maxAge: remember_me, httpOnly: false })
            ctx.cookies.set('userid', id, { maxAge: remember_me })
            //encode username to base64 format
            ctx.cookies.set('username', new Buffer(_username).toString('base64'), { maxAge: remember_me })
            ctx.success(token, 'login success')
        } else {
            ctx.error('user name or password error')
        }
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * R-login with weixin
 * @method jscode2session
 * @param  {[type]}   ctx [description]
 * @return {[type]}       [description]
 */
exports.jscode2session = async ctx => {
    const { js_code } = ctx.request.body
    //get xhr requeset from weixin offical api with axios lib
    const xhr = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
            appid: mpappApiId,
            secret: mpappSecret,
            js_code,
            grant_type: 'authorization_code',
        },
    })
    ctx.success(xhr.data, 'login success')
}
/**
 * R/C-login with weixin
 * @method wxLogin
 * @param  {[type]}   ctx [description]
 * @return {[type]}       [description]
 */
exports.wxLogin = async ctx => {
    let id, token, username
    const { nickName, wxSignature, avatar } = ctx.request.body
    if (!nickName || !wxSignature) {
        ctx.error('args error, weixin login fails')
    } else {
        try {
            const result = await User.findOneAsync({
                username: nickName,
                wx_signature: wxSignature,
                is_delete: 0,
            })
            if (result) {
                id = result._id
                username = encodeURI(nickName)
                //sign username to token with jwt lib and some config
                token = jwt.sign({ id, username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
                ctx.success(
                    {
                        user: token,
                        userid: id,
                        username,
                    },
                    'login success'
                )
            } else {
                const _result = await User.createAsync({
                    username: nickName,
                    password: '',
                    email: '',
                    creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    is_delete: 0,
                    timestamp: moment().format('X'),
                    wx_avatar: avatar,
                    wx_signature: wxSignature,
                })
                id = _result._id
                username = encodeURI(nickName)
                token = jwt.sign({ id, username }, secret, { expiresIn: 60 * 60 * 24 * 30 })
                ctx.success(
                    {
                        user: token,
                        userid: id,
                        username,
                    },
                    'create success'
                )
            }
        } catch (err) {
            ctx.error(err.toString())
        }
    }
}

/**
 * U-user logout
 * @method logout
 * @param  {[type]}   ctx [description]
 * @return {[type]}       [description]
 */
exports.logout = async ctx => {
    ctx.cookies.set('user', '', { maxAge: -1, httpOnly: false })
    ctx.cookies.set('userid', '', { maxAge: -1 })
    ctx.cookies.set('username', '', { maxAge: -1 })
    ctx.success('', 'logout success')
}

/**
 * U-create user
 * @method insert
 * @param  {[type]}    ctx  [description]
 * @return {json}         [description]
 */
exports.insert = async ctx => {
    const { email, password, username } = ctx.request.body
    if (!username || !password || !email) {
        ctx.error('please fill on form first')
    } else if (strlen(username) < 4) {
        ctx.error('user at least require 2 chinese char  or 4 english char')
    } else if (strlen(password) < 8) {
        ctx.error('password at least require 8 char')
    } else {
        try {
            const result = await User.findOneAsync({ username })
            if (result) {
                ctx.error('user name has been created')
            } else {
                await User.createAsync({
                    username,
                    password: md5(md5Pre + password),
                    email,
                    creat_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    is_delete: 0,
                    timestamp: moment().format('X'),
                })
                ctx.success('success', 'create success')
            }
        } catch (err) {
            ctx.error(err.toString())
        }
    }
}

exports.getItem = async ctx => {
    const userid = ctx.query.id || ctx.cookies.get('userid') || ctx.header['userid']
    try {
        const result = await User.findOneAsync({ _id: userid, is_delete: 0 })
        if (result) {
            ctx.success(result)
        } else {
            ctx.error('please login first, or data error')
        }
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * U-update user
 * @method modify
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.modify = async ctx => {
    const { id, email, password, username } = ctx.request.body
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const data = { email, username, update_date }
    //encode password with md5 lib and some config
    if (password) data.password = md5(md5Pre + password)
    await modify(ctx, User, id, data)
}

/**
 * U-update account
 * @method account
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.account = async ctx => {
    const { id, email } = ctx.request.body
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const user_id = ctx.cookies.get('userid') || ctx.header['userid']
    const username = ctx.request.body.username || ctx.header['username']
    if (user_id === id) {
        try {
            await User.updateAsync({ _id: id }, { $set: { email, username, update_date } })
            ctx.success('success', 'update success')
        } catch (err) {
            ctx.error(err.toString())
        }
    } else {
        ctx.error('without access right')
    }
}

/**
 * U-update password
 * @method password
 * @param  {[type]}    ctx [description]
 * @return {[type]}        [description]
 */
exports.password = async ctx => {
    const { id, old_password, password } = ctx.request.body
    const update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const user_id = ctx.cookies.get('userid') || ctx.header['userid']
    if (user_id === id) {
        try {
            const result = await User.findOneAsync({ _id: id, password: md5(md5Pre + old_password), is_delete: 0 })
            if (result) {
                await User.updateAsync({ _id: id }, { $set: { password: md5(md5Pre + password), update_date } })
                ctx.success('success', 'update success')
            } else {
                ctx.error('the origin password error')
            }
        } catch (err) {
            ctx.error(err.toString())
        }
    } else {
        ctx.error('without access right')
    }
}

/**
 * D-delete user
 * @method deletes
 * @param  {[type]}    ctx [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.deletes = async ctx => {
    await deletes(ctx, User)
}

/**
 * U-recover user
 * @method recover
 * @param  {[type]}    ctx [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.recover = async ctx => {
    await recover(ctx, User)
}
