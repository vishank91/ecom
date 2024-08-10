const passwordValidator = require('password-validator')
const bcrypt = require("bcrypt")
const User = require("../models/User")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const { sendMailText } = require("../mailer/mail")

const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase(1)                              // Must have lowercase letters
    .has().digits(1)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'Admin@123', "User@123"]); // Blacklist these values

async function createUser(req, res) {
    if (schema.validate(req.body.password)) {
        let data = new User(req.body)
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error)
                res.status(500).send({ result: "Fail", error: "Internal Server Error" })
            else {
                try {
                    data.password = hash
                    data.role = "Buyer"
                    await data.save()
                    res.send({ result: "Done", data: data })
                    sendMailText(
                        data.email,
                        "Your Account Has Been Created : Team Ducat",
                        `
                            Hello ${data.name}
                            Your account has been created
                            now you can buy our latest products
                            Team : Ducat
                        `
                    )
                } catch (error) {
                    console.log(error)
                    let errorMessage = {}
                    if (error.keyValue?.username) {
                        errorMessage.username = "User Name is Already Taken"
                        errorMessage.status = 400
                    }
                    if (error.keyValue?.email) {
                        errorMessage.email = "Email Address is Already Taken"
                        errorMessage.status = 400
                    }
                    if (error.errors?.name) {
                        errorMessage.name = error.errors.name.message
                        errorMessage.status = 400
                    }
                    if (error.errors?.username) {
                        errorMessage.username = error.errors.username.message
                        errorMessage.status = 400
                    }
                    if (error.errors?.email) {
                        errorMessage.email = error.errors.email.message
                        errorMessage.status = 400
                    }
                    if (!(Object.values(errorMessage).find(x => x.length !== 0))) {
                        errorMessage.reason = "Internal Server Error"
                        errorMessage.status = 500
                    }
                    res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
                }
            }
        })
    }
    else
        res.status(400).send({ result: "Fail", error: "Invalid Password!!! Password Must Contains Atleast 1 Upper, Case Character 1 Lower Case Character, 1 Digit, Doesn't Contains Space and Length Must Be 8-100" })
}
async function getUser(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleUser(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateUser(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
            data.active = req.body.active ?? data.active
            if (req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", data: data, message: "Record is Updated" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function deleteUser(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
            res.send({ result: "Done", error: "Record is Deleted" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function login(req, res) {
    try {
        let data = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
                jwt.sign({ data }, key, { expiresIn: 60 * 60 * 24 * 2 }, (error, token) => {
                    if (error)
                        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
                    else
                        res.send({ result: "Done", data: data, token: token })
                })
            }
            else
                res.status(404).send({ result: "Fail", error: "Invalid Username or Password" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Invalid Username or Password" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] })
        if (data) {
            let otp = Math.random().toString().slice(2, 8)
            data.otp = otp
            await data.save()
            sendMailText(
                data.email,
                "OTP for Password Reset : Team Ducat",
                `
                    Hello ${data.name}
                    OTP for Password Reset is ${otp}
                    never share OTP with anyone
                    Team : Ducat
                `
            )
            res.send({ result: "Done", message: "OTP is Sent on Your Registered Email Address" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Invalid Username or Email Address" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({ result: "Done", error: "OTP is Macted" })
            else
                res.send({ result: "Fail", error: "OTP is Invalid" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Invalid Username or Email Address" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] })
        if (data) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", error: "Internal Server Error" })
                else {
                    data.password = hash
                    await data.save()
                    res.send({ result: "Done", message: "Passwor has been reset" })
                }
            })
        }
        else
            res.status(404).send({ result: "Fail", error: "Invalid Username or Email Address" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

module.exports = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}