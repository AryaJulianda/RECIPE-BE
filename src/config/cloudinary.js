const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dgwlgaxtm', 
  api_key: '282263685197785', 
  api_secret: '5u0TJghvWyle7iJGuBbsCZZ1SPw' 
});

module.exports = cloudinary;
