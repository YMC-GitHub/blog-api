// ================ frontend ================
// this is for frontend
// ================ frontend ================

// inclue route engine for koa framework
const router = require('koa-router')()
// inclue some api files
const frontendArticle = require('../api/frontend-article')
const frontendComment = require('../api/frontend-comment')
const frontendLike = require('../api/frontend-like')
const frontendUser = require('../api/frontend-user')
const isUser = require('../middlewares/user')

// ================= frontend =================
// ------ article ------
// R-get article list
router.get('/article/list', frontendArticle.getList)
// R-get an article
router.get('/article/item', frontendArticle.getItem)
// R-get hot article
//router.get('/trending', frontendArticle.getTrending)
// ------ comment ------
// C-create comment
router.post('/comment/insert', isUser, frontendComment.insert)
// R-get comment list
router.get('/comment/list', frontendComment.getList)
// ------ user ------
// C-create user
router.post('/user/insert', frontendUser.insert)
// R-user login
router.post('/user/login', frontendUser.login)
// R-user login with weixin by code2
router.post('/user/jscode2session', frontendUser.jscode2session)
router.post('/user/wxLogin', frontendUser.wxLogin)
// U-user logout
router.post('/user/logout', isUser, frontendUser.logout)
// R-get user acount msg
router.get('/user/account', isUser, frontendUser.getItem)
// U-update user acount msg
router.post('/user/account', isUser, frontendUser.account)
// U-update user password
router.post('/user/password', isUser, frontendUser.password)
// ------ like ------
// C-create like
router.get('/like', isUser, frontendLike.like)
// D-delete like
router.get('/unlike', isUser, frontendLike.unlike)
// U-reset like
router.get('/reset/like', isUser, frontendLike.resetLike)

module.exports = router
