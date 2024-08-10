const Cart = require("../models/Cart")

async function createCart(req, res) {
    try {
        let data = new Cart(req.body)
        await data.save()
        let finalData = await Cart.findOne({ _id: data._id })
            .populate("user", { name: 1 })
            .populate({
                path: "product",
                select: "_id name brand color size stock quantity pic finalPrice",
                options: { slice: { pic: 1 } },
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ]
            })
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.errors?.user) {
            errorMessage.user = error.errors.user.message
            errorMessage.status = 400
        }
        if (error.errors?.product) {
            errorMessage.product = error.errors.product.message
            errorMessage.status = 400
        }
        if (error.errors?.qty) {
            errorMessage.qty = error.errors.qty.message
            errorMessage.status = 400
        }
        if (error.errors?.total) {
            errorMessage.total = error.errors.total.message
            errorMessage.status = 400
        }
        if (!(Object.values(errorMessage).find(x => x.length !== 0))) {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}
async function getCart(req, res) {
    try {
        let data = await Cart.find()
            .populate("user", { name: 1 })
            .populate({
                path: "product",
                select: "_id name brand color size stock quantity pic finalPrice",
                options: { slice: { pic: 1 } },
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ]
            }).sort({ _id: 1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleCart(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
            .populate("user", { name: 1 })
            .populate({
                path: "product",
                select: "_id name brand color size stock quantity pic finalPrice",
                options: { slice: { pic: 1 } },
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ]
            })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}

async function updateCart(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
        if (data) {
            data.qty = req.body.qty ?? data.qty
            data.total = req.body.total ?? data.total
            await data.save()
            let finalData = await Cart.findOne({ _id: data._id })
                .populate("user", { name: 1 })
                .populate({
                    path: "product",
                    select: "_id name brand color size stock quantity pic finalPrice",
                    options: { slice: { pic: 1 } },
                    populate: [
                        {
                            path: "brand",
                            select: "name -_id",
                        }
                    ]
                })
            res.send({ result: "Done", data: finalData })
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            errorMessage.name = "Cart Name is Already Exist"
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

async function deleteCart(req, res) {
    try {
        let data = await Cart.findOne({ _id: req.params._id })
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
    createCart,
    getCart,
    getSingleCart,
    updateCart,
    deleteCart
}