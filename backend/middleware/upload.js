const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Если заданы переменные Cloudinary — фото уходят в облако (нужно для Render/Railway,
// т.к. на бесплатных тарифах локальные файлы стираются при каждом деплое/рестарте).
// Если переменных нет — используется обычное локальное хранение (удобно для разработки).
const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

let storage;
let extractUrl;

if (useCloudinary) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'sportshop',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    },
  });

  extractUrl = (file) => file.path; // Cloudinary кладёт сюда полный secure_url
} else {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });

  extractUrl = (file) => `/uploads/${file.filename}`;
}

const fileFilter = (req, file, cb) => {
  if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) cb(null, true);
  else cb(new Error('Разрешены только изображения'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { upload, extractUrl, useCloudinary };
