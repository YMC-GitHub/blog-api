const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/ymc_blog')
mongoose.Promise = global.Promise
module.exports = mongoose
