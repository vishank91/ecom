const UserRoutes = require("express").Router()
const { createUser, getUser, getSingleUser, updateUser, deleteUser, login,forgetPassword1, forgetPassword2, forgetPassword3 } = require("../controllers/UserController")
const { userUploader } = require("../middleware/fileUpload")
const { verifyBoth, verifyAdmin } = require("../middleware/authentication")

UserRoutes.post("/", createUser)
UserRoutes.get("/", verifyAdmin, getUser)
UserRoutes.get("/:_id", verifyBoth, getSingleUser)
UserRoutes.put("/:_id", verifyBoth, userUploader.single('pic'), updateUser)
UserRoutes.delete("/:_id", verifyAdmin, deleteUser)
UserRoutes.post("/login", login)
UserRoutes.post("/forget-password-1", forgetPassword1)
UserRoutes.post("/forget-password-2", forgetPassword2)
UserRoutes.post("/forget-password-3", forgetPassword3)


module.exports = UserRoutes

