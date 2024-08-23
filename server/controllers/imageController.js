const cloudinary = require("cloudinary").v2;

// Upload images to Cloudinary and get URLs
const imageUpload = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        ).end(file.buffer); // Upload the file buffer
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls: urls });
  } catch (error) {
    console.error("Error uploading images:", error.message);
    res.status(500).json({ message: "Error uploading images." });
  }
};

module.exports = { imageUpload };
