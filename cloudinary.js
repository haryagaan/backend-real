const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: "dt2qlgnd6",
  api_key: "517613321561649",
  api_secret: "tnJ52HFFUf-WjX9bCD8i3SuCZWI"
});


exports.cloudinary=cloudinary;