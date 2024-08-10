const multer = require('multer')

function createUploader(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/' + folderName)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return storage
}

const brandUploader = multer({ storage: createUploader('brands') })
const testimonialUploader = multer({ storage: createUploader('testimonials') })
const productUploader = multer({ storage: createUploader('products') })
const userUploader = multer({ storage: createUploader('users') })

module.exports = {
    brandUploader,
    testimonialUploader,
    productUploader,
    userUploader
}