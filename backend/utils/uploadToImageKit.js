const imagekit = require("../config/imagekit");

const uploadToImageKit = async (file, athleteFolder, documentName) => {
  try {
    const extension = file.originalname.split(".").pop();

    const result = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `${documentName}.${extension}`,
      folder: `/athletes/${athleteFolder}`,
    });

    return result.url;
  } catch (error) {
    console.error(error);
    throw new Error("Image upload failed");
  }
};

module.exports = uploadToImageKit;
