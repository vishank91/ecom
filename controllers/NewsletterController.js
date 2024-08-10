const Newsletter = require("../models/Newsletter")
const { sendMailText } = require("../mailer/mail")

async function createNewsletter(req, res) {
    try {
        let data = new Newsletter(req.body)
        await data.save()
        res.send({ result: "Done", data: data,message:"Thanks to Subscibe Our Newsletter Service" })
        sendMailText(
            data.email,
            "Newsletter Subscribed : Team Ducat",
            `
                Thanks to Subscibe Our Newsletter Service
                Now we can send email regarding latest products and great offerse and deals
                Team : Ducat
            `
        )
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            errorMessage.email = "Email Address is Already Registered"
            errorMessage.status = 400
        }
        else if (error.errors.email) {
            errorMessage.email = error.errors.email.message
            errorMessage.status = 400
        }
        else {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}
async function getNewsletter(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleNewsletter(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateNewsletter(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()
            res.send({ result: "Done", data: data, message: "Record is Updated" })
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            errorMessage.name = "Newsletter Name is Already Exist"
            errorMessage.status = 400
        }
        else if (error.errors.name) {
            errorMessage.name = error.errors.name.message
            errorMessage.status = 400
        }
        else {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}

async function deleteNewsletter(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
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

module.exports = {
    createNewsletter,
    getNewsletter,
    getSingleNewsletter,
    updateNewsletter,
    deleteNewsletter
}