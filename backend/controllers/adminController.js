const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const loginAdmin = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { username, password } = req.body;

    // ✅ STEP 1: FIND ADMIN
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });

    console.log("ADMIN FOUND:", admin);

    // ❌ admin not found
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ STEP 2: CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ STEP 3: CREATE TOKEN WITH ROLE
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        role: "Admin",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: "Admin",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { loginAdmin };
