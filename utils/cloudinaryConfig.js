const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'aleezainnovation',
  api_key: '353314667413585',
  api_secret: 'EJK9GA9HJKt4eQDlwIQp0OM8C9A',
});

module.exports = cloudinary;
