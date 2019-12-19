const mongoose = require('mongoose')
mongoose.Promise = global.Promise
//let ip = "192.168.2.3" //host ip is ok
let ip = "172.20.1.2"//custom internal network is ok
mongoose.connect(`mongodb://${ip}:27017/ymc_blog`, {
    useNewUrlParser: true,
    //fix: DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
    useUnifiedTopology: true
}).then(() => console.log('connected'))
    .catch(err => console.log(err))
/*
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MONGODB connection established");
});
*/
module.exports = mongoose
