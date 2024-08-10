const Testimonial = require("../models/Testimonial")
const fs = require("fs")
async function createTestimonial(req, res) {
    try {
        let data = new Testimonial(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.errors?.name) {
            errorMessage.name = error.errors.name.message
            errorMessage.status = 400
        }
        if (error.errors?.message) {
            errorMessage.message = error.errors.message.message
            errorMessage.status = 400
        }
        if (error.errors?.pic) {
            errorMessage.pic = error.errors.pic.message
            errorMessage.status = 400
        }
        if (!(Object.values(errorMessage).find(x => x.length !== 0))) {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}
async function getTestimonial(req, res) {
    try {
        let data = await Testimonial.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleTestimonial(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateTestimonial(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.message = req.body.message ?? data.message
            data.star = req.body.star ?? data.star
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

async function deleteTestimonial(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
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

module.exports = {
    createTestimonial,
    getTestimonial,
    getSingleTestimonial,
    updateTestimonial,
    deleteTestimonial
}