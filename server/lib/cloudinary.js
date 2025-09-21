const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.SECRET_CLOUDINARY_API_SECRET,
});

// Log configuration for debugging
// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.SECRET_CLOUDINARY_API_SECRET ? '[REDACTED]' : 'undefined',
// });

module.exports = cloudinary;