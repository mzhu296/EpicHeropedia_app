// const mongoose =require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: {
//         type : String,
//         unique: true
//     },
//     password: String,
//     role: {
//         type: String,
//         enum: ['user', 'siteManager', 'admin'],
//         default: 'user'
//     },
//     isDisabled: {
//         type: Boolean,
//         default: false
//     },
//     ListName: {
//         type: Array,
//         required: true,
//     },
//     description:{
//         type: String,
//         required: false,
//     },
//     visibility: {
//         type: Boolean,
//         required: true,
//     },
//     reviews: {
//         type: Array,
//         required: false,
//       },
//     lastEdited:{
//           type:Date,
//           required:true
//     }
// })

// const UserModel = mongoose.model('User' , userSchema);

const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type : String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'siteManager', 'admin'],
        default: 'user'
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model('User' , userSchema);

module.exports = UserModel;