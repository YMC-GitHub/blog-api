// ================ admin ================
// this is a custom koa middleware admin
// ================ admin ================
// task:
// check if user is admin:
// 01.need to login first
// 02.need to check the user
// if true,goto next middleware

//include custom  koa middleware check
const check = require('./check')

module.exports = async (ctx, next) => {
    //get sth. from cookies with the ctx
    const token = ctx.cookies.get('b_user')
    const userid = ctx.cookies.get('b_userid')
    let username = ctx.cookies.get('b_username') || ''
    //encode the username for safety
    username = new Buffer(username, 'base64').toString()
    if (token) {
        const decoded = await check(token, 'admin')
        if (decoded && decoded.id === userid && decoded.username === username) {
            ctx.decoded = decoded
            // goto next middleware
            await next()
        } else {
            ctx.cookies.set('b_user', '', { maxAge: 0, httpOnly: false })
            ctx.cookies.set('b_userid', '', { maxAge: 0 })
            ctx.cookies.set('b_username', '', { maxAge: 0 })
            ctx.body = {
                code: -500,
                message: 'login fails',
                data: '',
            }
        }
    } else {
        ctx.body = {
            code: -500,
            message: 'need to login first',
            data: '',
        }
    }
}
