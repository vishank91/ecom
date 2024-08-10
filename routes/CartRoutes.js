const CartRoutes = require("express").Router()
const { createCart, getCart, getSingleCart, updateCart, deleteCart } = require("../controllers/CartController")
const { verifyBoth } = require("../middleware/authentication")

CartRoutes.post("/", verifyBoth, createCart)
CartRoutes.get("/", verifyBoth, getCart)
CartRoutes.get("/:_id", verifyBoth, getSingleCart)
CartRoutes.put("/:_id", verifyBoth, updateCart)
CartRoutes.delete("/:_id", verifyBoth, deleteCart)

module.exports = CartRoutes

