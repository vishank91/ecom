const NewsletterRoutes = require("express").Router()
const { createNewsletter, getNewsletter, getSingleNewsletter, updateNewsletter, deleteNewsletter } = require("../controllers/NewsletterController")
const { verifyAdmin } = require("../middleware/authentication")

NewsletterRoutes.post("/", createNewsletter)
NewsletterRoutes.get("/", verifyAdmin, getNewsletter)
NewsletterRoutes.get("/:_id", verifyAdmin, getSingleNewsletter)
NewsletterRoutes.put("/:_id", verifyAdmin, updateNewsletter)
NewsletterRoutes.delete("/:_id", verifyAdmin, deleteNewsletter)

module.exports = NewsletterRoutes

