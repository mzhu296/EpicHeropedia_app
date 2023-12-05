require('dotenv').config();
const UserModel = require('./models/user');
const { hashPassword } = require('./helpers/auth'); 
const express = require('express');
const cors = require("cors");
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser')
const app = express();

//database connection
mongoose.connect(`mongodb://localhost:27017/database`)
    .then(() => {
        console.log("Database Connected :)");
        initializeAdminAccount(); 
    })
    .catch((err) => {
        console.log("Database not connected :(" + err);
    })
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

async function initializeAdminAccount() {
    try {
        const adminExists = await UserModel.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
            const adminUser = new UserModel({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword, // use the hashed password here
            });

            await adminUser.save();
            console.log('Admin account created'); 
        }
    } catch (err) {
        console.error('Error creating admin account:', err);
    }
}


//middleware
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/authRoutes'));

const port = 5000;
app.listen(port, () => {
    console.log(`Server is listenning on port ${port}.`)
})