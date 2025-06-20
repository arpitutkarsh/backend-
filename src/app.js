import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

//the below code is used for cross origin resource sharing 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//the above code is used for cross origin resource sharing
app.use(express.json({
    limit: "20mb"
}))
//to take data from the URL
app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}))
app.use(cookieParser())

//Importing routes
import userRouter  from '../src/routes/user.routes.js'
//ROute declarartion

app.use("/api/v1/users", userRouter)  //whenever the url /user gets hit it transfer the control to userRouer that is user.routes.js






export {app};