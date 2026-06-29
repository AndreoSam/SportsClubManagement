const Athlete = require("../models/Athlete");
const User = require("../models/User");

const getAthleteProfile = async (req, res) => {
  try {
    const athlete = await Athlete.findOne({
      "personal.email": req.user.email,
    });

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: "Athlete profile not found",
      });
    }

    return res.json({
      success: true,
      athlete: athlete,
    });
  } catch (error) {
    console.error("GET ATHLETE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAthleteProfile = async (req, res) => {
  try {
    const { personal, guardian, address, club, competition } = req.body;

    const updateData = {};

    if (personal) updateData.personal = personal;
    if (guardian) updateData.guardian = guardian;
    if (address) updateData.address = address;
    if (club) updateData.club = club;
    if (competition) updateData.competition = competition;

    const athlete = await Athlete.findOneAndUpdate(
      { "personal.email": req.user.email },
      updateData,
      { new: true }
    );

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: "Athlete profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      athlete: athlete,
    });
  } catch (error) {
    console.error("UPDATE ATHLETE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAthleteProfile,
  updateAthleteProfile,
};
