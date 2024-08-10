const WishlistRoutes = require("express").Router()
const { createWishlist, getWishlist, deleteWishlist } = require("../controllers/WishlistController")
const { verifyBoth } = require("../middleware/authentication")

WishlistRoutes.post("/", verifyBoth, createWishlist)
WishlistRoutes.get("/", verifyBoth, getWishlist)
WishlistRoutes.delete("/:_id", verifyBoth, deleteWishlist)

module.exports = WishlistRoutes

