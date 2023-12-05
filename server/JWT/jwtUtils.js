const User = require("../models/user");
const { hashPassword, comparePassword } = require('../hash/auth');
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json("TEST IS WORKING...")
}


//function to register a user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //Check if name, password , email was entered
        if (!name) {
            return res.json({
                error: 'Name is required'
            })
        };
        if (!password || password.length < 5) {
            return res.json({
                error: 'Password is required and should be at least 5 character long'
            })
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is already in use'
            })
        }

        const hashedPassword = await hashPassword(password);

        //creating user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
}

//function to login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No User Found :('
            })
        }

        //check if password matches
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({
                email: user.email,
                id: user._id,
                name: user.name
            }, 
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(user)
                })
        }
        if (!match) {
            res.json({
                error: "Password doesn't match :("
            })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    test,
    registerUser,
    loginUser
}