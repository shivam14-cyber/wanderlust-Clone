const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name:process.env.CLOUDNAME,
  api_key:process.env.CLOUDAPTKEY,
  api_secret:process.env.CLOUDAPTSECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_Dev',
    allowerdFormats: ["png","jpg","jpeg"]
  },
});

module.exports={
  cloudinary,
  storage
}