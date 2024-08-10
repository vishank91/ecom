const MaincategoryRoutes = require("express").Router()
const { createMaincategory, getMaincategory, getSingleMaincategory, updateMaincategory, deleteMaincategory } = require("../controllers/MaincategoryController")
const { verifyAdmin } = require("../middleware/authentication")

MaincategoryRoutes.post("/", verifyAdmin, createMaincategory)
MaincategoryRoutes.get("/", getMaincategory)
MaincategoryRoutes.get("/:_id", getSingleMaincategory)
MaincategoryRoutes.put("/:_id", verifyAdmin, updateMaincategory)
MaincategoryRoutes.delete("/:_id", verifyAdmin, deleteMaincategory)

module.exports = MaincategoryRoutes

