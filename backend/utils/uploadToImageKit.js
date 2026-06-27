const imagekit = require("../config/imagekit");

const uploadToImageKit = async (file, folder = "athletes") => {
  try {
    const result = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `${Date.now()}-${file.originalname}`,
      folder: `/${folder}`,
    });

    return result.url;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

module.exports = uploadToImageKit;
