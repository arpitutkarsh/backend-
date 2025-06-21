import { Router } from "express"; 
import { registerUser } from "../controllers/user.controller.js";
//to handle file we need to import upload from multer.middleware.js
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,

        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

export default router