const Athlete = require("../models/Athlete");
const uploadToImageKit = require("../utils/uploadToImageKit");

// 👉 helper to calculate age from DOB
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

const registerAthlete = async (req, res) => {
  try {
    console.log("=== BODY ===");
    console.log(req.body);

    console.log("=== FILES ===");
    console.log(req.files);

    const data = JSON.parse(req.body.data);
    const files = req.files;

    // ✅ FIX: calculate age here (IMPORTANT FIX)
    data.personal.age = calculateAge(data.personal.dob);

    const uploadedFiles = {};

    // ---------------- IMAGEKIT UPLOADS ----------------

    try {
      console.log("Uploading passport photo...");
      uploadedFiles.passportPhoto = await uploadToImageKit(
        files.passportPhoto[0],
      );
      console.log("Passport uploaded:", uploadedFiles.passportPhoto);
    } catch (err) {
      console.log("Passport upload failed:", err.message);
    }

    try {
      console.log("Uploading birth certificate...");
      uploadedFiles.birthCertificate = await uploadToImageKit(
        files.birthCertificate[0],
      );
      console.log("Birth uploaded:", uploadedFiles.birthCertificate);
    } catch (err) {
      console.log("Birth upload failed:", err.message);
    }

    try {
      console.log("Uploading medical certificate...");
      uploadedFiles.medicalCertificate = await uploadToImageKit(
        files.medicalCertificate[0],
      );
      console.log("Medical uploaded:", uploadedFiles.medicalCertificate);
    } catch (err) {
      console.log("Medical upload failed:", err.message);
    }

    try {
      console.log("Uploading consent form...");
      uploadedFiles.consentForm = await uploadToImageKit(files.consentForm[0]);
      console.log("Consent uploaded:", uploadedFiles.consentForm);
    } catch (err) {
      console.log("Consent upload failed:", err.message);
    }

    // ---------------- SAVE TO DB ----------------

    const athlete = await Athlete.create({
      ...data,
      documents: uploadedFiles,
    });

    console.log("SAVED ATHLETE:", athlete);

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
    const { status } = req.body;

    const allowed = ["Pending", "Approved", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const athlete = await Athlete.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found",
      });
    }

    return res.json({
      success: true,
      athlete,
    });
  } catch (error) {
    return res.status(500).json({
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
