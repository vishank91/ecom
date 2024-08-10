const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User id is Mendatory"]
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is Mendatory"]
    },
    qty:{
        type: Number,
        required: [true, "Quantity is Mendatory"]
    },
    total:{
        type: Number,
        required: [true, "Total is Mendatory"]
    }
})
const Cart = new mongoose.model("Cart", CartSchema)

module.exports = Cart