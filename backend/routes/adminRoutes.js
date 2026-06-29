const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  exportToExcel,
  getAnalytics,
} = require("../controllers/adminApplicationsController");

// Public route (no login needed)
router.post("/login", loginAdmin);

// Protected routes
router.get(
  "/applications",
  authMiddleware,
  checkRole(["Admin"]),
  getApplications
);

router.get(
  "/application/:id",
  authMiddleware,
  checkRole(["Admin"]),
  getApplicationById
);

router.patch(
  "/application/:id/status",
  authMiddleware,
  checkRole(["Admin"]),
  updateApplicationStatus
);

router.delete(
  "/application/:id",
  authMiddleware,
  checkRole(["Admin"]),
  deleteApplication
);

router.get(
  "/applications/export",
  authMiddleware,
  checkRole(["Admin"]),
  exportToExcel
);

router.get(
  "/analytics",
  authMiddleware,
  checkRole(["Admin"]),
  getAnalytics
);

module.exports = router;
