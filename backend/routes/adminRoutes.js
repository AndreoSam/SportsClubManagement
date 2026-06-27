const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route (no login needed)
router.post("/login", loginAdmin);

// Protected route (needs JWT token)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    admin: req.admin,
  });
});

module.exports = router;
