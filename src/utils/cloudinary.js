import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //it will be used for file handling

cloudinary.config({
    cloud_name: 'daga0ry6c',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//To uopload the file what we will do is, first we will store the file in our local server/storage then will upload to cloudinary and then we will delete the file from our local storage
const uploadonCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log("File uploaded successfully", response)
        //console.log(url)
        fs.unlinkSync(localFilePath)

        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath) // it will remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadonCloudinary};
