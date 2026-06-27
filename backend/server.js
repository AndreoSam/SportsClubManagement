const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const athleteRoutes = require("./routes/athleteRoutes");

const adminRoutes = require("./routes/adminRoutes");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/athletes", athleteRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Sports Club Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
