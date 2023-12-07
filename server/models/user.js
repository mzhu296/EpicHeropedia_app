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

// module.exports = UserModel;

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: String,
//   role: {
//     type: String,
//     enum: ['user', 'siteManager', 'admin'],
//     default: 'user',
//   },
//   isDisabled: {
//     type: Boolean,
//     default: false,
//   },
//   superheroLists: [
//     {
//       listName: {
//         type: String,
//         required: true,
//       },
//       description: String,
//       heroes: {
//         type: String,
//         required: true,
//       },
//       visibility: {
//         type: String,
//         enum: ['public', 'private'],
//         default: 'private',
//       },
//       creator: String,
//       reviews: [
//         {
//           rating: {
//             type: Number,
//             required: true,
//           },
//           comment: String,
//         },
//       ],
//     },
//   ],
//   lastEdited: {
//     type: Date,
//     required: true,
//   },
// });

// const UserModel = mongoose.model('User', userSchema);

// module.exports = UserModel;
