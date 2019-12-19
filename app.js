// ================ backend index ================
// this is the app index file for backend
// ================ backend index================
//task:

const path = require('path')
//use koa framework
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')
const convert = require('koa-convert')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

//include some data model files
require('./server/models/admin')
require('./server/models/article')
require('./server/models/category')
require('./server/models/comment')
require('./server/models/user')

//include some route files
const index = require('./server/routes/index')

//use some koa middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
// for statci serve in public path
app.use(convert(require('koa-static')(path.join(__dirname, 'public'))))
// for statci web serve in views path
app.use(views(path.join(__dirname, 'views'), { extension: 'ejs' }))
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    // log the access histroy with console.log
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    if (ctx.status === 404) {
        const err = new Error('Not Found')
        err.status = 404
        ctx.body = {
            tag: 'error',
            status: err.status,
            message: err.message,
            stack: err.stack,
        }
    }
})
//use cunstom koa middleware return
app.use(require('./server/middlewares/return'))
app.use(index.routes(), router.allowedMethods())
//bind an error function to app
app.on('error', function (err, ctx) {
    console.error('server error', err, ctx)
})

module.exports = app
