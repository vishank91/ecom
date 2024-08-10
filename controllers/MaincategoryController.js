const Maincategory = require("../models/Maincategory")

async function createMaincategory(req, res) {
    try {
        let data = new Maincategory(req.body)
        await data.save()
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            errorMessage.name = "Maincategory Name is Already Exist"
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
async function getMaincategory(req, res) {
    try {
        let data = await Maincategory.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleMaincategory(req, res) {
    try {
        let data = await Maincategory.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateMaincategory(req, res) {
    try {
        let data = await Maincategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
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
            errorMessage.name = "Maincategory Name is Already Exist"
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

async function deleteMaincategory(req, res) {
    try {
        let data = await Maincategory.findOne({ _id: req.params._id })
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
    createMaincategory,
    getMaincategory,
    getSingleMaincategory,
    updateMaincategory,
    deleteMaincategory
}