import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"
dotenv.config()



connectDB()
.then(() => {
    app.listen(process.env.port || 8000, () => {
        console.log(`Server is running on port ${process.env.port || 8000}`)
    })
})
.catch((error) => {
    console.log("Error connecting to DATABASE:", error)
})




/*
THIS IS OUR FIRST APPROACH TO CONNECTING TO MONGODB
(async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    }
    catch(error){
        console.log("Error connecting to MongoDB:", error)
        throw error
    }
})()
*/