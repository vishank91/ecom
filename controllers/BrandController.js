const Brand = require("../models/Brand")
const fs = require("fs")
async function createBrand(req, res) {
    try {
        let data = new Brand(req.body)
        if(req.file){
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
async function getBrand(req, res) {
    try {
        let data = await Brand.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleBrand(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateBrand(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            if(req.file){
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) {}
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

async function deleteBrand(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) {}
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
    createBrand,
    getBrand,
    getSingleBrand,
    updateBrand,
    deleteBrand
}