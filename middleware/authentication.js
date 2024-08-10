const jwt = require("jsonwebtoken")

function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN, (error) => {
        if (error)
            res.send({ result: "Fail", error: "Token Verification Fail. Invalid Token or Expired Token. Please Login Again" })
        else
            next()
    })
}
function verifyBoth(req, res, next) {
    let token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN, (error) => {
        if (error) {
            jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER, (error) => {
                if (error)
                    res.send({ result: "Fail", error: "Token Verification Fail. Invalid Token or Expired Token. Please Login Again" })
                else
                    next()
            })
        }
        else
            next()
    })
}
module.exports = {
    verifyAdmin,
    verifyBoth
}