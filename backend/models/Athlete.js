const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema(
  {
    personal: {
      fullName: {
        type: String,
        required: true,
      },

      gender: {
        type: String,
        required: true,
      },

      dob: {
        type: Date,
        required: true,
      },

      age: {
        type: Number,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
        unique: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      bloodGroup: {
        type: String,
      },
    },

    guardian: {
      guardianName: String,

      relation: String,

      mobile: String,

      email: String,
    },

    address: {
      address: String,

      district: String,

      state: String,

      pinCode: String,
    },

    club: {
      clubName: String,

      coachName: String,

      coachMobile: String,

      stateAssociation: String,
    },

    competition: {
      competitionName: String,

      ageGroup: String,

      weightCategory: String,

      event: String,
    },

    documents: {
      passportPhoto: String,

      birthCertificate: String,

      medicalCertificate: String,

      consentForm: String,
    },

    status: {
      type: String,

      default: "Pending",
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Athlete", athleteSchema);
