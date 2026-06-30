const User = require("../models/User");
const Athlete = require("../models/Athlete");
const CoachProfile = require("../models/CoachProfile");
const ExcelJS = require("exceljs");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/emailNotifications");

const getApplications = async (req, res) => {
  try {
    const {
      search = "",
      role = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    // Get all users
    let users = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Apply search filter
    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.mobile.includes(search)
      );
    }

    // Fetch detailed information for each application
    const applications = await Promise.all(
      users.map(async (user) => {
        let profileData = null;

        if (user.role === "Athlete") {
          profileData = await Athlete.findOne({
            "personal.email": user.email,
          });
        } else if (user.role === "Coach") {
          profileData = await CoachProfile.findOne({
            userId: user._id,
          });
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          profileData: profileData,
        };
      })
    );

    const total = await User.countDocuments(query);

    return res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    let profileData = null;

    if (user.role === "Athlete") {
      profileData = await Athlete.findOne({
        "personal.email": user.email,
      });
    } else if (user.role === "Coach") {
      profileData = await CoachProfile.findOne({
        userId: user._id,
      });
    }

    return res.json({
      success: true,
      application: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        profileData: profileData,
      },
    });
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const allowed = ["Pending", "Approved", "Rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (status === "Rejected" && (!rejectionReason || rejectionReason.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required when rejecting an application",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update User status
    user.status = status;
    await user.save();

    // Update profile status based on role
    if (user.role === "Athlete") {
      await Athlete.updateOne(
        { "personal.email": user.email },
        {
          status,
          ...(status === "Rejected" && { rejectionReason }),
          reviewedBy: req.user?.email || "Admin",
          reviewedAt: new Date(),
        }
      );
    } else if (user.role === "Coach") {
      await CoachProfile.updateOne(
        { userId: user._id },
        {
          status,
          ...(status === "Rejected" && { rejectionReason }),
          reviewedBy: req.user?.email || "Admin",
          reviewedAt: new Date(),
        }
      );
    }

    // Send status notification email
    try {
      if (status === "Approved") {
        await sendApprovalEmail(user.email, user.name, user.role);
        console.log("Approval email sent to:", user.email);
      } else if (status === "Rejected") {
        await sendRejectionEmail(user.email, user.name, user.role, rejectionReason);
        console.log("Rejection email sent to:", user.email);
      }
    } catch (emailError) {
      console.error("Failed to send status notification email:", emailError);
    }

    return res.json({
      success: true,
      message: "Application status updated successfully",
    });
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete based on role
    if (user.role === "Athlete") {
      await Athlete.deleteOne({ "personal.email": user.email });
    } else if (user.role === "Coach") {
      await CoachProfile.deleteOne({ userId: user._id });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportToExcel = async (req, res) => {
  try {
    const { role = "", status = "" } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Role", key: "role", width: 12 },
      { header: "Status", key: "status", width: 12 },
      { header: "Registered Date", key: "createdAt", width: 20 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=applications.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("EXPORT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalApplications = await User.countDocuments();

    const totalAthletes = await User.countDocuments({ role: "Athlete" });
    const totalCoaches = await User.countDocuments({ role: "Coach" });

    const pending = await User.countDocuments({ status: "Pending" });
    const approved = await User.countDocuments({ status: "Approved" });
    const rejected = await User.countDocuments({ status: "Rejected" });

    return res.json({
      success: true,
      analytics: {
        totalApplications,
        totalAthletes,
        totalCoaches,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  exportToExcel,
  getAnalytics,
};
