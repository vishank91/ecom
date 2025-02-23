const router = require("express").Router()
const MaincategoryRoutes = require("./MaincategoryRoutes")
const SubcategoryRoutes = require("./SubcategoryRoutes")
const BrandRoutes = require("./BrandRoutes")
const TestimonialRoutes = require("./TestimonialRoutes")
const ProductRoutes = require("./ProductRoutes")
const UserRoutes = require("./UserRoutes")
const CartRoutes = require("./CartRoutes")
const WishlistRoutes = require("./WishlistRoutes")
const CheckoutRoutes = require("./CheckoutRoutes")
const NewsletterRoutes = require("./NewsletterRoutes")
const ContactUsRoutes = require("./ContactUsRoutes")

router.use("/maincategory", MaincategoryRoutes)
router.use("/subcategory", SubcategoryRoutes)
router.use("/brand", BrandRoutes)
router.use("/testimonial", TestimonialRoutes)
router.use("/product", ProductRoutes)
router.use("/user", UserRoutes)
router.use("/cart", CartRoutes)
router.use("/wishlist", WishlistRoutes)
router.use("/checkout", CheckoutRoutes)
router.use("/newsletter", NewsletterRoutes)
router.use("/contactus", ContactUsRoutes)


module.exports = router