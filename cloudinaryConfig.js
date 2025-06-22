const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wonderlust_DEV",
    allowedFormats: ["jpg", "jpeg", "png"], // ✅ बरोबर camelCase
    // public_id: (req, file) => Date.now().toString(),  // ऐच्छिक
  },
});

module.exports = { storage, cloudinary };
