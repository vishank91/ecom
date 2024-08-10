const Checkout = require("../models/Checkout")
const Razorpay = require("razorpay")

const { sendMailText } = require("../mailer/mail")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.status(200).send({ result: "Done" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
async function createCheckout(req, res) {
    try {
        let data = new Checkout(req.body)
        data.date = new Date()
        await data.save()
        let finalData = await Checkout.findOne({ _id: data._id })
            .populate({
                path: "user",
                select: "name email phone address pin city state"
            })
            .populate({
                path: "products.product",
                select: "-_id name color finalPrice pic size",
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ],
                options: { slice: { pic: 1 } }
            })
        res.send({ result: "Done", data: finalData })
        sendMailText(
            finalData.user.email,
            "Your Order Has Been Placed : Team Ducat",
            `
                Hello ${finalData.user.name}
                Your Order Has Been Placed
                Now You Can Track Your Order in Profile Page
                Team : Ducat
            `
        )
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.errors.user) {
            errorMessage.user = error.errors.user.message
            errorMessage.status = 400
        }
        if (error.errors.subtotal) {
            errorMessage.subtotal = error.errors.subtotal.message
            errorMessage.status = 400
        }
        if (error.errors.shipping) {
            errorMessage.shipping = error.errors.shipping.message
            errorMessage.status = 400
        }
        if (error.errors.total) {
            errorMessage.total = error.errors.total.message
            errorMessage.status = 400
        }
        else {
            errorMessage.reason = "Internal Server Error"
            errorMessage.status = 500
        }
        res.status(errorMessage.status).send({ result: "Fail", error: errorMessage })
    }
}
async function getCheckout(req, res) {
    try {
        let data = await Checkout.find()
            .populate({
                path: "user",
                select: "name email phone address pin city state"
            })
            .populate({
                path: "products.product",
                select: "-_id name color finalPrice pic size",
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ],
                options: { slice: { pic: 1 } }
            }).sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getUserCheckout(req, res) {
    try {
        let data = await Checkout.find({ user: req.params._id })
            .populate({
                path: "user",
                select: "name email phone address pin city state"
            })
            .populate({
                path: "products.product",
                select: "-_id name color finalPrice pic size",
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ],
                options: { slice: { pic: 1 } }
            }).sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).send({ result: "Fail", error: "Internal Server Error" })
    }
}
async function getSingleCheckout(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate({
                path: "user",
                select: "name email phone address pin city state"
            })
            .populate({
                path: "products.product",
                select: "-_id name color finalPrice pic size",
                populate: [
                    {
                        path: "brand",
                        select: "name -_id",
                    }
                ],
                options: { slice: { pic: 1 } }
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

async function updateCheckout(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()
            let finalData = await Checkout.findOne({ _id: data._id })
                .populate({
                    path: "user",
                    select: "name email phone address pin city state"
                })
                .populate({
                    path: "products.product",
                    select: "-_id name color finalPrice pic size",
                    populate: [
                        {
                            path: "brand",
                            select: "name -_id",
                        }
                    ],
                    options: { slice: { pic: 1 } }
                })
            res.send({ result: "Done", data: finalData, message: "Record is Updated" })
            sendMailText(
                finalData.user.email,
                `${finalData.orderStatus} : Team Ducat`,
                `
                    Hello ${finalData.user.name}
                    Your Order Status Has Been Changed
                    Status : ${finalData.orderStatus}
                    Team : Ducat
                `
            )
        }
        else
            res.status(404).send({ result: "Fail", error: "Record not found" })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            errorMessage.name = "Checkout Name is Already Exist"
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

async function deleteCheckout(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
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
    createCheckout,
    getCheckout,
    getUserCheckout,
    getSingleCheckout,
    updateCheckout,
    deleteCheckout,
    order,
    verifyOrder
}