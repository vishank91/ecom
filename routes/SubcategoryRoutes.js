const SubcategoryRoutes = require("express").Router()
const { createSubcategory, getSubcategory, getSingleSubcategory, updateSubcategory, deleteSubcategory } = require("../controllers/SubcategoryController")
const { verifyAdmin } = require("../middleware/authentication")

SubcategoryRoutes.post("/", verifyAdmin, createSubcategory)
SubcategoryRoutes.get("/", getSubcategory)
SubcategoryRoutes.get("/:_id", getSingleSubcategory)
SubcategoryRoutes.put("/:_id", verifyAdmin, updateSubcategory)
SubcategoryRoutes.delete("/:_id", verifyAdmin, deleteSubcategory)

module.exports = SubcategoryRoutes

