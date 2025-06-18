import connectDB from "./db/index.js"
import dotenv from "dotenv"

dotenv.config()



connectDB()




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