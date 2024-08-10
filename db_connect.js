const mongoose = require("mongoose")

async function getConnect() {
    // mongoose.connect("mongodb://localhost:27017/we_9am_june24_server")
    //     .then(() => {
    //         console.log("Database is Connected")
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })

    try {
        // await mongoose.connect("mongodb://localhost:27017/we_9am_june24_server")
        await mongoose.connect(process.env.DB_KEY)
        console.log("Database is Connected")
    } catch (error) {
        console.log(error)
    }
}
getConnect()