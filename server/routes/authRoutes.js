require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser } = require('../JWT/jwtUtils')

//middleware
router.use(
    cors({
        credentials: true,
        origin: process.env.REACT_APP_ORIGIN,
    })
)

router.get('/', test);
router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router;