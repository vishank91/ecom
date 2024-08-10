const ProductRoutes = require("express").Router()
const { createProduct, getProduct, getSingleProduct, updateProduct, deleteProduct, updateProductQuantity } = require("../controllers/ProductController")
const { productUploader } = require("../middleware/fileUpload")
const { verifyAdmin, verifyBoth } = require("../middleware/authentication")

ProductRoutes.post("/", verifyAdmin, productUploader.array('pic'), createProduct)
ProductRoutes.get("/", getProduct)
ProductRoutes.get("/:_id", getSingleProduct)
ProductRoutes.put("/:_id", verifyAdmin, productUploader.array('pic'), updateProduct)
ProductRoutes.put("/quantity/:_id", verifyBoth, updateProductQuantity)
ProductRoutes.delete("/:_id", verifyAdmin, deleteProduct)

module.exports = ProductRoutes

