// ================ user ================
// this is a custom koa middleware user
// ================ user ================
// task:
// check if user is user:
// 01.need to login first
// 02.need to check the user
// if true,goto next middleware

//include custom  koa middleware check
const check = require('./check')

module.exports = async (ctx, next) => {
    //get sth. from cookies with the ctx
    const token = ctx.cookies.get('user') || ctx.header['user']
    const userid = ctx.cookies.get('userid') || ctx.header['userid']
    let username = ctx.cookies.get('username') || ctx.header['username'] || ''
    //encode the username for safety
    username = new Buffer(username, 'base64').toString()
    if (token) {
        const decoded = await check(token, 'user')
        if (decoded && decoded.id === userid && decoded.username === username) {
            ctx.decoded = decoded
            // goto next middleware
            await next()
        } else {
            ctx.cookies.set('user', '', { maxAge: 0, httpOnly: false })
            ctx.cookies.set('userid', '', { maxAge: 0 })
            ctx.cookies.set('username', '', { maxAge: 0 })
            ctx.body = {
                code: -400,
                message: 'login fails',
                data: '',
            }
        }
    } else {
        ctx.body = {
            code: -400,
            message: 'need to login first',
            data: '',
        }
    }
}
