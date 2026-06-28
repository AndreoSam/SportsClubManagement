const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

// Optional: Try Google's DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const bcrypt = require("bcrypt");

console.log("URI:", process.env.MONGO_URI);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB");

    const Admin = require("../models/Admin");

    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hash,
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
