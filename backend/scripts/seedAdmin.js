const mongoose = require("mongoose");
require("dotenv").config();

const bcrypt = require("bcrypt");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected");

    const Admin = require("../models/Admin");

    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    await Admin.deleteMany({});

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      username: process.env.ADMIN_USERNAME, // ✅ added
      email: process.env.ADMIN_EMAIL,
      password: hash,
    });

    console.log("Admin created");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
