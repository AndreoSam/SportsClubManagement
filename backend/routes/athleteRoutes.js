const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  registerAthlete,
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
  getAthleteAnalytics,
} = require("../controllers/athleteController");

// multiple file fields
router.post(
  "/register",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "medicalCertificate", maxCount: 1 },
    { name: "consentForm", maxCount: 1 },
  ]),
  registerAthlete,
);

router.get("/analytics/summary", protect, getAthleteAnalytics);
router.get("/", protect, getAllAthletes);
router.get("/:id", protect, getAthleteById);
router.patch("/:id/status", protect, updateAthleteStatus);

module.exports = router;
