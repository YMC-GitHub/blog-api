
// ================ index ================
// this is route index file
// ================ index ================

// inclue route engine for koa framework
const router = require('koa-router')()

// inclue some route file
const backend = require('./backend')
const frontend = require('./frontend')

const backendUser = require('../api/backend-user')

// route for backend
/*
router.get('/backend', async ctx => {
    // get data and set the state for ctx
    ctx.state = {
        title: '后台登录',
        message: '',
    }
    //ctx render the view tpl with the state data
    await ctx.render('admin-add', {})
})
router.post('/backend', backendUser.insert)
*/

// route for api
router.use('/api/backend', backend.routes(), backend.allowedMethods())
router.use('/api/frontend', frontend.routes(), frontend.allowedMethods())

// route for other
router.get('*', async ctx => {
    ctx.body = '404 Not Found'
})

module.exports = router
