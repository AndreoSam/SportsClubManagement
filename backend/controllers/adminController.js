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
        message: "Invalid credentials",
      });
    }

    // ✅ STEP 2: CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ✅ STEP 3: CREATE TOKEN
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { loginAdmin };
