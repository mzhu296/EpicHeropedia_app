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

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No User Found :('
            });
        }

        // Check if the user is disabled
        if (user.isDisabled) {
            return res.json({
                error: "Your account is disabled. Please contact the administrator."
            });
        }

        // Check if password matches
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({
                error: "Password doesn't match :("
            });
        }

        // Generate JWT token
        jwt.sign({
            email: user.email,
            name: user.name,
            role: user.role 
        }, 
        process.env.JWT_SECRET,
        {},
        (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(user)
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
}

module.exports = {
    test,
    registerUser,
    loginUser
}