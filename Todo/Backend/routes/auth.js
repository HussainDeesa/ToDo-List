const express = require('express')
const router = express.Router()
require('dotenv').config();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { json } = require('express');
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET

let success = false;
let successname = false;

//ROUTE:1 Create a User POST "/api/auth/createuser"

router.post('/createuser', [
    body('name', 'Enter valid name of minimum 3 characters').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter a password with atleat 7 characters').isLength({ min: 7 })
], async (req, res) => {
    // If error occurs then return bad request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        success = false
        successname = false
        return res.status(400).json({ errors: errors.array() })
    }
    // Check if email already exist
    try {
        let user = await User.findOne({ success, email: req.body.email })
        let username = await User.findOne({ success, name: req.body.name })
        if (user) {
            success = false
            return res.status(400).json({ success, error: "Sorry a user with this email already exist" })
        }
        if (username) {
            successname = false
            return res.status(400).json({ successname, error: "Sorry a user with this username already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        // create user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        successname = true
        // res.json(user)
        res.json({ success, authToken, successname })
    } catch (error) {
        success = false
        successname = false
        console.error(error.message)
        res.status(500).send("Some Error Occured")
    }
})
//ROUTE:2 Authenticate a user using POST /api/auth/login

router.post('/login', [
    body('password', 'Password cannot be blank').exists(),
    body('name', 'Username cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, password } = req.body;
    try {
        let user = await User.findOne({ name })
        if (!user) {
            success = false
            return res.status(400).json({ success, errors: "Please enter correct credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, errors: "Please enter correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error Occured")
    }
})

//ROUTE:3 Get loggedin user details using POST: api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error Occured")
    }
})

router.put('/changeuser', fetchuser, async (req, res) => {
    try {
        const newUser = {}
        const userId = req.user.id
        let username = req.body.name;
        let user = await User.findById(userId).select('-password')
        let checkuser = await User.findOne({ successname, name: username })
        if (checkuser) {
            successname = false
            return res.status(400).json({ successname, error: "Sorry a user with this username already exist" })
        }
        else {
            if (username) { newUser.name = username };
            user = await User.updateOne({ "name": user.name }, { $set: { "name": username } }, { new: true })
        }
        success = true
        successname = true
        res.json({ successname, user })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error Occured")
    }
})

router.put('/changepassword', [
  
    body('newpassword', 'Enter a password with atleat 7 characters').isLength({ min: 7 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, password } = req.body;

    try {
        let user = await User.findOne({ name })
        if (!user) {
            success = false
            return res.status(400).json({ success, errors: "Please enter correct credentials" })
        }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.newpassword, salt)
            user = await User.updateOne({ "name": user.name }, { $set: { "password": secPass } }, { new: true })
        
        success = true
        res.json({ success,user })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error Occured")
    }
})


module.exports = router