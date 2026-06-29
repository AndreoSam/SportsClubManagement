const express = require("express");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  registerCoach,
  getCoachProfile,
  updateCoachProfile,
} = require("../controllers/coachController");

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "governmentId", maxCount: 1 },
    { name: "coachingCertificate", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  registerCoach
);

router.get("/profile", authMiddleware, checkRole(["Coach"]), getCoachProfile);

router.put("/profile", authMiddleware, checkRole(["Coach"]), updateCoachProfile);

module.exports = router;
