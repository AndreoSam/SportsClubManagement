const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
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

router.get("/analytics/summary", authMiddleware, getAthleteAnalytics);
router.get("/", authMiddleware, getAllAthletes);
router.get("/:id", authMiddleware, getAthleteById);
router.patch("/:id/status", authMiddleware, updateAthleteStatus);

module.exports = router;
