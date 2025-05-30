import multer from "multer";
import fs from "fs";
import path from "path";
const dir = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + path.extname(file.originalname));
  },
});
const filterFiles = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const filterProductImages = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const uploadProductImages = multer({
  storage: storage,
  fileFilter: filterProductImages,
  limits: { fileSize: 15 * 1024 * 1024 },
}); // 5 MB limit
const uploadProfile = multer({
  storage: storage,
  fileFilter: filterFiles,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5 MB limit

export { uploadProfile, uploadProductImages };
