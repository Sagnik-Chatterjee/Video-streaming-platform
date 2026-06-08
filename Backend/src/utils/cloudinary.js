import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary=async (localFilePath) => {
    try{
        if(!localFilePath){
            return null
        }
        const response =await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response
    }catch(error){
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteCloudinary = async (cloudinaryUrl, resourceType = "image") => {
    try {
        if (!cloudinaryUrl) {
            return null;
        }
        const urlParts = cloudinaryUrl.split('/');
        const fileNameWithExtension = urlParts.pop();
        const publicIdWithoutExtension = fileNameWithExtension.split('.')[0];
        
        const uploadIndex = urlParts.findIndex(part => part === "upload");
        const folders = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = folders ? `${folders}/${publicIdWithoutExtension}` : publicIdWithoutExtension;
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType  });
        return response;

    } catch (error) {
        console.log("Error while deleting from Cloudinary: ", error);
        return null;
    }
};

export {uploadCloudinary,deleteCloudinary}