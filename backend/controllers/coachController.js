const User = require("../models/User");
const CoachProfile = require("../models/CoachProfile");
const Otp = require("../models/Otp");
const uploadToImageKit = require("../utils/uploadToImageKit");
const bcrypt = require("bcryptjs");
const { sendRegistrationEmail } = require("../utils/emailNotifications");

const generateCoachFolder = (fullName, coachId) => {
  const sanitizedName = fullName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  return `${sanitizedName}_coach_${coachId}`;
};

const registerCoach = async (req, res) => {
  try {
    console.log("=== COACH REGISTRATION BODY ===");
    console.log(req.body);

    console.log("=== COACH FILES ===");
    console.log(req.files);

    const data = JSON.parse(req.body.data);

    const verifiedOtp = await Otp.findOne({
      email: data.personal.email,
      verified: true,
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: data.personal.email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Check if mobile already exists
    const existingMobile = await User.findOne({
      mobile: data.personal.mobile,
    });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number is already registered.",
      });
    }

    const files = req.files;

    const tempId = Date.now().toString();
    const coachFolder = generateCoachFolder(data.personal.fullName, tempId);

    console.log("Generated coach folder:", coachFolder);

    const uploadedFiles = {
      folderName: coachFolder,
    };

    // Upload documents
    try {
      console.log("Uploading passport photo...");
      uploadedFiles.passportPhoto = await uploadToImageKit(
        files.passportPhoto[0],
        coachFolder,
        "passportPhoto"
      );
      console.log("Passport photo uploaded:", uploadedFiles.passportPhoto);
    } catch (err) {
      console.log("Passport photo upload failed:", err.message);
      throw new Error(`Passport photo upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading government ID...");
      uploadedFiles.governmentId = await uploadToImageKit(
        files.governmentId[0],
        coachFolder,
        "governmentId"
      );
      console.log("Government ID uploaded:", uploadedFiles.governmentId);
    } catch (err) {
      console.log("Government ID upload failed:", err.message);
      throw new Error(`Government ID upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading coaching certificate...");
      uploadedFiles.coachingCertificate = await uploadToImageKit(
        files.coachingCertificate[0],
        coachFolder,
        "coachingCertificate"
      );
      console.log("Coaching certificate uploaded:", uploadedFiles.coachingCertificate);
    } catch (err) {
      console.log("Coaching certificate upload failed:", err.message);
      throw new Error(`Coaching certificate upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading resume...");
      uploadedFiles.resume = await uploadToImageKit(
        files.resume[0],
        coachFolder,
        "resume"
      );
      console.log("Resume uploaded:", uploadedFiles.resume);
    } catch (err) {
      console.log("Resume upload failed:", err.message);
      throw new Error(`Resume upload failed: ${err.message}`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create User record
    const user = await User.create({
      name: data.personal.fullName,
      email: data.personal.email,
      mobile: data.personal.mobile,
      password: hashedPassword,
      role: "Coach",
      status: "Pending",
    });

    console.log("User created:", user._id);

    // Create Coach Profile
    const coachProfile = await CoachProfile.create({
      userId: user._id,
      personal: data.personal,
      address: data.address,
      qualification: data.qualification,
      experience: data.experience,
      club: data.club,
      documents: uploadedFiles,
      status: "Pending",
    });

    console.log("Coach profile created:", coachProfile._id);

    // Delete verified OTP
    await Otp.deleteOne({
      email: data.personal.email,
    });

    // Send registration confirmation email
    try {
      await sendRegistrationEmail(data.personal.email, data.personal.fullName, "Coach");
      console.log("Registration email sent to:", data.personal.email);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Coach registered successfully",
      coach: coachProfile,
    });
  } catch (error) {
    console.log("COACH REGISTRATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCoachProfile = async (req, res) => {
  try {
    const coachProfile = await CoachProfile.findOne({
      userId: req.user.userId,
    }).populate("userId", "name email mobile status");

    if (!coachProfile) {
      return res.status(404).json({
        success: false,
        message: "Coach profile not found",
      });
    }

    return res.json({
      success: true,
      coach: coachProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCoachProfile = async (req, res) => {
  try {
    const { personal, address, qualification, experience, club } = req.body;

    const coachProfile = await CoachProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        ...(personal && { personal }),
        ...(address && { address }),
        ...(qualification && { qualification }),
        ...(experience && { experience }),
        ...(club && { club }),
      },
      { new: true }
    );

    if (!coachProfile) {
      return res.status(404).json({
        success: false,
        message: "Coach profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      coach: coachProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerCoach,
  getCoachProfile,
  updateCoachProfile,
};
