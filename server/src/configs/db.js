
const mongoose = require("mongoose")
require("dotenv").config()
const URL = `mongodb://localhost:27017/database`

module.exports = () => {
    try {
        return mongoose.connect(URL)
    }
    catch (err) {
        return { "Message": err.Message }
    }
}
