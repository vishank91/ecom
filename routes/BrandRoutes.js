const BrandRoutes = require("express").Router()
const { createBrand, getBrand, getSingleBrand, updateBrand, deleteBrand } = require("../controllers/BrandController")
const { brandUploader } = require("../middleware/fileUpload")
const { verifyAdmin } = require("../middleware/authentication")

BrandRoutes.post("/", verifyAdmin, brandUploader.single('pic'), createBrand)
BrandRoutes.get("/", getBrand)
BrandRoutes.get("/:_id", getSingleBrand)
BrandRoutes.put("/:_id", verifyAdmin, brandUploader.single('pic'), updateBrand)
BrandRoutes.delete("/:_id", verifyAdmin, deleteBrand)

module.exports = BrandRoutes

