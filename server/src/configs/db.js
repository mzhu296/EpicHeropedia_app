
const mongoose = require("mongoose")
require("dotenv").config()
//const URL = process.env.MONGODB_URL

module.exports = () => {
    try {
        return mongoose.connect("localhost:27017/databaseName")
    }
    catch (err) {
        return { "Message": err.Message }
    }
}

