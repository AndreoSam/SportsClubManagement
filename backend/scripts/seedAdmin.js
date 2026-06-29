const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { username: "admin" },
        { email: "admin@example.com" }
      ]
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123456", 10);

    // Create admin user
    const admin = await Admin.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully!");
    console.log("Username: admin");
    console.log("Email: admin@example.com");
    console.log("Password: admin123456");
    console.log("\nYou can now login with these credentials at /login");

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();
