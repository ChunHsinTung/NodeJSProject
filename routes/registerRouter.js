const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Rgister/GET Route success");
})

router.post('/', (req, res) => {
    console.log(req.body)
    const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
    newUser.save()
        .then(() => {
            console.log(`New user created: Name: ${req.body.name}`);
            res.status(200).json(
                {
                    "name": req.body.name,
                    "email": req.body.email,
                    "password": req.body.password
                }
            );
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
});

module.exports = router