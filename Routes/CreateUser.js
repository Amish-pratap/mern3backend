const express = require('express')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../models/User')
const jwtSecret = 'mynameisanthonygonzarwis871263382176@#$'
router.post('/createuser', [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'incorrect password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt)
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: "User with this email already exists." }] });
        }
        await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location,
        })
        res.json({ success: true })
    } catch (err) {
        console.log(err)
        res.json({ success: false })
    }
})


router.post('/loginuser', [
    body('email').isEmail(),
    body('password', 'incorrect password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: [{ msg: "Invalid Email. Please try logging in with correct credentials." }] });
        }
        const pwdCompare = await bcrypt.compare(password, userData.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: [{ msg: "Invalid Password. Please try logging in with correct credentials." }] });
        }
        const data = {
            user: {
                id: userData.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret)

        return res.json({ success: true, authToken: authToken });
    } catch (err) {
        console.error('Error finding user:', err);
        res.json({ success: false });
    }
});

module.exports = router