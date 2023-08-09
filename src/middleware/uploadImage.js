const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dgwlgaxtm', 
  api_key: '282263685197785', 
  api_secret: '5u0TJghvWyle7iJGuBbsCZZ1SPw'
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'recipe_images',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
});

module.exports = upload;
