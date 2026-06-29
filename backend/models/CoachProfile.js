const mongoose = require("mongoose");

const coachProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personal: {
      fullName: {
        type: String,
        required: true,
      },
      dob: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    address: {
      address: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
    qualification: {
      highestQualification: {
        type: String,
        required: true,
      },
      coachingCertification: {
        type: String,
        required: true,
      },
      licenseNumber: {
        type: String,
        required: true,
      },
    },
    experience: {
      yearsOfExperience: {
        type: Number,
        required: true,
      },
      previousClubs: {
        type: String,
        required: true,
      },
      sportsSpecialized: {
        type: String,
        required: true,
      },
    },
    club: {
      clubName: {
        type: String,
        required: true,
      },
      stateAssociation: {
        type: String,
        required: true,
      },
    },
    documents: {
      folderName: {
        type: String,
      },
      passportPhoto: {
        type: String,
      },
      governmentId: {
        type: String,
      },
      coachingCertificate: {
        type: String,
      },
      resume: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CoachProfile", coachProfileSchema);
