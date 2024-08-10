const ContactUs = require("../models/ContactUs")
const { sendMailText } = require("../mailer/mail")

async function createContactUs(req, res) {
    try {
        let data = new ContactUs(req.body)
        data.date = new Date()
        await data.save()
        sendMailText(
            data.email,
            "You Query Recieved : Team Ducat",
            `
                Hello ${data.name}
                You Query Recieved Our Team Will Contact You Soon
                Team : Ducat
            `
        )
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.errors.name) {
            errorMessage.name = error.errors.name.message
            errorMessage.status = 400
        }
        if (error.errors.email) {
            errorMessage.email = error.errors.email.message
            errorMessage.status = 400
        }
        if (error.errors.phone) {
            errorMessage.phone = error.errors.phone.message
            errorMessage.status = 400
        }
        if (error.errors.subject) {
            errorMessage.subject = error.errors.subject.message
            errorMessage.status = 400
        }
        if (error.errors.message) {
            errorMessage.message = error.errors.message.message
            errorMessage.status = 400
        }
        else {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}
async function getContactUs(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
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
            errorMessage.name = "ContactUs Name is Already Exist"
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

async function deleteContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
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
    createContactUs,
    getContactUs,
    getSingleContactUs,
    updateContactUs,
    deleteContactUs
}