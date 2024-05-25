const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const { generateTokens } = require('../utils/jwt');
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Rgister/GET Route success");
})

router.post('/', async (req, res) => {
    const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
    const userObject = await newUser.save()

    console.log(userObject)

    const userJWTToken = generateTokens(userObject)
    res.status(200).json(
        userJWTToken
    );
});

module.exports = router