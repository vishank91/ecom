const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is Mendatory"]
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Product Maincategory is Mendatory"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Product Subcategory is Mendatory"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Product Brand is Mendatory"]
    },
    color:{
        type: String,
        required: [true, "Product Color is Mendatory"]
    },
    size: {
        type: String,
        required: [true, "Product Size is Mendatory"]
    },
    basePrice:{
        type: Number,
        required: [true, "Product BasePrice is Mendatory"]
    },
    discount:{
        type: Number,
        required: [true, "Product BasePrice is Mendatory"]
    },
    finalPrice:{
        type: Number,
        required: [true, "Product BasePrice is Mendatory"]
    },
    quantity:{
        type: Number,
        required: [true, "Product BasePrice is Mendatory"]
    },
    stock:{
        type: Boolean,
        default:true
    },
    description:{
        type: String,
        default:""
    },
    pic:{
        type: Array,
        required: [true, "Product Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})
const Product = new mongoose.model("Product", ProductSchema)

module.exports = Product