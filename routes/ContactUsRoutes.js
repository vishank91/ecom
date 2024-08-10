const ContactUsRoutes = require("express").Router()
const { createContactUs, getContactUs, getSingleContactUs, updateContactUs, deleteContactUs } = require("../controllers/ContactUsController")
const { verifyAdmin } = require("../middleware/authentication")

ContactUsRoutes.post("/", createContactUs)
ContactUsRoutes.get("/", verifyAdmin, getContactUs)
ContactUsRoutes.get("/:_id", verifyAdmin, getSingleContactUs)
ContactUsRoutes.put("/:_id", verifyAdmin, updateContactUs)
ContactUsRoutes.delete("/:_id", verifyAdmin, deleteContactUs)

module.exports = ContactUsRoutes

