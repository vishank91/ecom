const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")
const fs = require("fs")
const { sendMailText } = require("../mailer/mail")

async function createProduct(req, res) {
    try {
        let data = new Product(req.body)
        if (req.files) {
            data.pic = req.files.map((item) => item.path)
        }
        await data.save()
        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", { name: 1 })
            .populate("subcategory", { name: 1 })
            .populate("brand", { name: 1 })
        res.send({ result: "Done", data: finalData })

        let emails = await Newsletter.find()
        emails.forEach((x) => {
            sendMailText(
                x.email,
                "New Product Listed : Team Ducat",
                `
                    Hello Dear,
                    We List a New Product
                    Please Checkout
                    Team : Ducat
                `
            )
        })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.errors?.name) {
            errorMessage.name = error.errors.name.message
            errorMessage.status = 400
        }
        if (error.errors?.maincategory) {
            errorMessage.maincategory = error.errors.maincategory.message
            errorMessage.status = 400
        }
        if (error.errors?.subcategory) {
            errorMessage.subcategory = error.errors.subcategory.message
            errorMessage.status = 400
        }
        if (error.errors?.brand) {
            errorMessage.brand = error.errors.brand.message
            errorMessage.status = 400
        }
        if (error.errors?.color) {
            errorMessage.color = error.errors.color.message
            errorMessage.status = 400
        }
        if (error.errors?.size) {
            errorMessage.size = error.errors.size.message
            errorMessage.status = 400
        }
        if (error.errors?.basePrice) {
            errorMessage.basePrice = error.errors.basePrice.message
            errorMessage.status = 400
        }
        if (error.errors?.discount) {
            errorMessage.discount = error.errors.discount.message
            errorMessage.status = 400
        }
        if (error.errors?.finalPrice) {
            errorMessage.finalPrice = error.errors.finalPrice.message
            errorMessage.status = 400
        }
        if (error.errors?.quantity) {
            errorMessage.quantity = error.errors.quantity.message
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
async function getProduct(req, res) {
    try {
        let data = await Product.find()
            .populate("maincategory", { name: 1 })
            .populate("subcategory", { name: 1 })
            .populate("brand", { name: 1 })
            .sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleProduct(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", { name: 1 })
            .populate("subcategory", { name: 1 })
            .populate("brand", { name: 1 })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateProduct(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.color = req.body.color ?? data.color
            data.size = req.body.size ?? data.size
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.quantity = req.body.quantity ?? data.quantity
            data.stock = req.body.stock ?? data.stock
            data.description = req.body.description ?? data.description
            data.active = req.body.active ?? data.active
            if (req.files) {
                for (let item of data.pic) {
                    try {
                        if (!(req.body.oldPics.includes(item)))
                            fs.unlinkSync(item)
                    } catch (error) { }
                }
                data.pic = req.files.map((item) => item.path).concat(req.body.oldPics?.split(",")).filter((x) => x !== "")
            }
            await data.save()
            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", { name: 1 })
                .populate("subcategory", { name: 1 })
                .populate("brand", { name: 1 })
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function updateProductQuantity(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.quantity = req.body.quantity ?? data.quantity
            if (data.quantity == 0)
                data.stock = false
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

async function deleteProduct(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            for (let item of data.pic)
                try {
                    fs.unlinkSync(item)
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
    createProduct,
    getProduct,
    getSingleProduct,
    updateProduct,
    updateProductQuantity,
    deleteProduct
}