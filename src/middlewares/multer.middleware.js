import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/temp") //we are inserting the file in temp folder of the public folder that we have created
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
}) 

export const upload = multer({
    storage,
})