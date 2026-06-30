const Athlete = require("../models/Athlete");
const User = require("../models/User");
const Otp = require("../models/Otp");
const uploadToImageKit = require("../utils/uploadToImageKit");
const bcrypt = require("bcryptjs");
const { sendRegistrationEmail } = require("../utils/emailNotifications");

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const generateAthleteFolder = (fullName, athleteId) => {
  const sanitizedName = fullName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  return `${sanitizedName}_${athleteId}`;
};

const registerAthlete = async (req, res) => {
  try {
    console.log("=== BODY ===");
    console.log(req.body);

    console.log("=== FILES ===");
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

    const files = req.files;

    data.personal.age = calculateAge(data.personal.dob);

    // Check if email already exists in User collection
    const existingUser = await User.findOne({
      email: data.personal.email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Check if mobile already exists in User collection
    const existingMobile = await User.findOne({
      mobile: data.personal.mobile,
    });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number is already registered.",
      });
    }

    const tempId = Date.now().toString();
    const athleteFolder = generateAthleteFolder(data.personal.fullName, tempId);

    console.log("Generated athlete folder:", athleteFolder);

    const uploadedFiles = {
      folderName: athleteFolder,
    };

    // Transactional upload behavior: all uploads must succeed
    try {
      console.log("Uploading passport photo...");
      uploadedFiles.passportPhoto = await uploadToImageKit(
        files.passportPhoto[0],
        athleteFolder,
        "passportPhoto",
      );
      console.log("Passport uploaded:", uploadedFiles.passportPhoto);
    } catch (err) {
      console.log("Passport upload failed:", err.message);
      throw new Error(`Passport upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading birth certificate...");
      uploadedFiles.birthCertificate = await uploadToImageKit(
        files.birthCertificate[0],
        athleteFolder,
        "birthCertificate",
      );
      console.log("Birth certificate uploaded:", uploadedFiles.birthCertificate);
    } catch (err) {
      console.log("Birth certificate upload failed:", err.message);
      throw new Error(`Birth certificate upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading medical certificate...");
      uploadedFiles.medicalCertificate = await uploadToImageKit(
        files.medicalCertificate[0],
        athleteFolder,
        "medicalCertificate",
      );
      console.log("Medical certificate uploaded:", uploadedFiles.medicalCertificate);
    } catch (err) {
      console.log("Medical certificate upload failed:", err.message);
      throw new Error(`Medical certificate upload failed: ${err.message}`);
    }

    try {
      console.log("Uploading consent form...");
      uploadedFiles.consentForm = await uploadToImageKit(
        files.consentForm[0],
        athleteFolder,
        "consentForm",
      );
      console.log("Consent form uploaded:", uploadedFiles.consentForm);
    } catch (err) {
      console.log("Consent form upload failed:", err.message);
      throw new Error(`Consent form upload failed: ${err.message}`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create User record
    const user = await User.create({
      name: data.personal.fullName,
      email: data.personal.email,
      mobile: data.personal.mobile,
      password: hashedPassword,
      role: "Athlete",
      status: "Pending",
    });

    console.log("User created:", user._id);

    // All uploads succeeded, now save to database
    const athlete = await Athlete.create({
      ...data,
      documents: uploadedFiles,
    });

    await Otp.deleteOne({
      email: data.personal.email,
    });

    console.log("SAVED ATHLETE:", athlete);

    // Send registration confirmation email
    try {
      await sendRegistrationEmail(data.personal.email, data.personal.fullName, "Athlete");
      console.log("Registration email sent to:", data.personal.email);
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }

    return res.status(201).json({
      success: true,
      athlete,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAthletes = async (req, res) => {
  try {
    const { search = "", status, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🔍 SEARCH (name or mobile)
    if (search) {
      query.$or = [
        { "personal.fullName": { $regex: search, $options: "i" } },
        { "personal.mobile": { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 FILTER BY STATUS
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const athletes = await Athlete.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Athlete.countDocuments(query);

    return res.json({
      data: athletes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAthleteById = async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.params.id);

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found",
      });
    }

    return res.json(athlete);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAthleteStatus = async (req, res) => {
  try {
    const { status, review } = req.body;

    const allowed = ["Pending", "Approved", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Rejection reason is mandatory for rejection
    if (status === "Rejected" && (!review || review.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required when rejecting an athlete.",
      });
    }

    const updateData = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.admin?.username || "Admin",
    };

    if (status === "Rejected") {
      updateData.rejectionReason = review;
    } else {
      updateData.rejectionReason = "";
    }

    const athlete = await Athlete.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.json({
      success: true,
      athlete,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAthleteAnalytics = async (req, res) => {
  try {
    const totalAthletes = await Athlete.countDocuments();

    const pending = await Athlete.countDocuments({ status: "Pending" });
    const approved = await Athlete.countDocuments({ status: "Approved" });
    const rejected = await Athlete.countDocuments({ status: "Rejected" });

    return res.json({
      totalAthletes,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerAthlete,
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
  getAthleteAnalytics,
};
