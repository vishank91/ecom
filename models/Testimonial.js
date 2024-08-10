const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message is Mendatory"]
    },
    star: {
        type: Number,
        default: 5
    },
    pic: {
        type: String,
        required: [true, "Pic is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
})
const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial