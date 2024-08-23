const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("Cloudinary Connect -> Successfull");
  } catch (error) {
    console.log(error);
    console.log("Cloudinary Connect -> Unsuccessfull");
  }
};

module.exports = connectCloudinary;
