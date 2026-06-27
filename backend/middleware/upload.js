const multer = require("multer");

// Store files in memory (NOT disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const pdfType = "application/pdf";

  if (imageTypes.includes(file.mimetype) || file.mimetype === pdfType) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, PDF allowed"), false);
  }
};

// limits as per assignment
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max (PDF)
  },
});

module.exports = upload;
