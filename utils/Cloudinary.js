const cloudinary = require("cloudinary");


cloudinary.config({
  cloud_name: "divaaobuw",
  api_key: "417323232121459",
  api_secret: "***************************",
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new promise((reslove) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      reslove(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = cloudinaryUploadImg;
