const CheckoutRoutes = require("express").Router()
const { createCheckout, getCheckout, getUserCheckout, getSingleCheckout, updateCheckout, deleteCheckout, order, verifyOrder } = require("../controllers/CheckoutController")
const { verifyAdmin, verifyBoth } = require("../middleware/authentication")

CheckoutRoutes.post("/", verifyBoth, createCheckout)
CheckoutRoutes.get("/", verifyAdmin, getCheckout)
CheckoutRoutes.get("/user/:_id", verifyBoth, getUserCheckout)
CheckoutRoutes.get("/:_id", verifyAdmin, getSingleCheckout)
CheckoutRoutes.put("/:_id", verifyAdmin, updateCheckout)
CheckoutRoutes.delete("/:_id", verifyAdmin, deleteCheckout)
CheckoutRoutes.post("/orders", verifyBoth, order)
CheckoutRoutes.post("/verify", verifyBoth, verifyOrder)

module.exports = CheckoutRoutes

