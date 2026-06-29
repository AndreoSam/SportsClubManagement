const express = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const {
  getAthleteProfile,
  updateAthleteProfile,
} = require("../controllers/athleteProfileController");

const router = express.Router();

router.get("/profile", authMiddleware, checkRole(["Athlete"]), getAthleteProfile);

router.put("/profile", authMiddleware, checkRole(["Athlete"]), updateAthleteProfile);

module.exports = router;
