const TestimonialRoutes = require("express").Router()
const { createTestimonial, getTestimonial, getSingleTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/TestimonialController")
const { testimonialUploader } = require("../middleware/fileUpload")
const { verifyAdmin } = require("../middleware/authentication")

TestimonialRoutes.post("/", verifyAdmin, testimonialUploader.single('pic'), createTestimonial)
TestimonialRoutes.get("/", getTestimonial)
TestimonialRoutes.get("/:_id", getSingleTestimonial)
TestimonialRoutes.put("/:_id", verifyAdmin, testimonialUploader.single('pic'), updateTestimonial)
TestimonialRoutes.delete("/:_id", verifyAdmin, deleteTestimonial)

module.exports = TestimonialRoutes

