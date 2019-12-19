
// ================ backend ================
// this is for backend
// ================ backend ================

// inclue route engine for koa framework
const router = require('koa-router')()
// inclue some api files
const backendArticle = require('../api/backend-article')
const backendCategory = require('../api/backend-category')
const backendUser = require('../api/backend-user')
const frontendComment = require('../api/frontend-comment')
const frontendUser = require('../api/frontend-user')
const isAdmin = require('../middlewares/admin')

//bind url path to handle files
// ------- article -------
// R-get article list
router.get('/article/list', isAdmin, backendArticle.getList)
// R-get an article
router.get('/article/item', isAdmin, backendArticle.getItem)
// C-create article
router.post('/article/insert', isAdmin, backendArticle.insert)
// D-delete article
router.get('/article/delete', isAdmin, backendArticle.deletes)
// U-recover article
router.get('/article/recover', isAdmin, backendArticle.recover)
// U-update article
router.post('/article/modify', isAdmin, backendArticle.modify)
// ------- category -------
// R-get category list
router.get('/category/list', backendCategory.getList)
// R-get a category
router.get('/category/item', backendCategory.getItem)
// C-create category
router.post('/category/insert', isAdmin, backendCategory.insert)
// D-delete category
router.get('/category/delete', isAdmin, backendCategory.deletes)
// U-recover category
router.get('/category/recover', isAdmin, backendCategory.recover)
// U-update category
router.post('/category/modify', isAdmin, backendCategory.modify)
// ------- admin -------
// backend login
router.post('/admin/login', backendUser.login)
// R-get admin list
router.get('/admin/list', isAdmin, backendUser.getList)
// R-get a admin
router.get('/admin/item', isAdmin, backendUser.getItem)
// U-update admin
router.post('/admin/modify', isAdmin, backendUser.modify)
// D-delete admin
router.get('/admin/delete', isAdmin, backendUser.deletes)
// U-recover admin
router.get('/admin/recover', isAdmin, backendUser.recover)
// ------- user -------
// R-get user list
router.get('/user/list', isAdmin, frontendUser.getList)
// R-get a user
router.get('/user/item', isAdmin, frontendUser.getItem)
// U-update user
router.post('/user/modify', isAdmin, frontendUser.modify)
// D-delete user
router.get('/user/delete', isAdmin, frontendUser.deletes)
// U-recover user
router.get('/user/recover', isAdmin, frontendUser.recover)
// ------ comment ------
// D-delete comment
router.get('/comment/delete', isAdmin, frontendComment.deletes)
// U-recover comment
router.get('/comment/recover', isAdmin, frontendComment.recover)
module.exports = router
