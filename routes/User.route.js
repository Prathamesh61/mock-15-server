const { Router } = require("express")
const { userModel } = require("../models/User.model")

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    let { name, email, password } = req.body

    try {
        let user = await userModel.findOne({ email: email })
        if (user) {
            return res.status(409).send("Already Registered, Please Login")
        }
        else {
            bcrypt.hash(password, 6, async function (err, hash) {
                if (err) {
                    res.send({ "Error": "Something wrong" })
                    console.log(err);
                } else {
                    const newUser = new userModel({ name, email, password: hash })
                    await newUser.save()
                    res.send({ "message": "Succesfully Registered" })
                }
            })
        }
    } catch (err) {
        return res.status(401).send(e.message)
    }

})

userRouter.post("/login", async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    let hash = user.password
    bcrypt.compare(password, hash, async function (err, result) {
        if (user && result) {
            var token = jwt.sign({ email: email }, process.env.PRIVATE_KEY);
            res.send({ "message": "Login Successful", "token": token })

        } else {
            res.status(400).send({ "Error": "Something Error" })
        }
    })
})

module.exports = {
    userRouter
}