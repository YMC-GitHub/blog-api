// ================ return ================
// this is a custom koa middleware return
// ================ return ================
// task:
// bind error,success function to ctx to uniform the return result
// and goto next middleware

module.exports = async (ctx, next) => {
    //bind error function to ctx
    ctx.error = (message, data = '') => {
        ctx.body = {
            code: -200,
            message,
            data,
        }
    }
    //bind success function to ctx
    ctx.success = (data, message = '') => {
        ctx.body = {
            code: 200,
            message,
            data,
        }
    }
    //goto next middleware
    await next()
}
