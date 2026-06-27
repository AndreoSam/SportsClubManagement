"use client";

import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import "./RegistrationForm.css";

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      gender: "",
      dob: "",
      mobile: "",
      email: "",
    },
    guardian: {
      guardianName: "",
      relation: "",
      mobile: "",
      email: "",
    },
    address: {
      address: "",
      district: "",
      state: "",
      pinCode: "",
    },
    club: {
      clubName: "",
      coachName: "",
      coachMobile: "",
      stateAssociation: "",
    },
    competition: {
      competitionName: "",
      ageGroup: "",
      weightCategory: "",
      event: "",
    },
  });

  const [files, setFiles] = useState({
    passportPhoto: null,
    birthCertificate: null,
    medicalCertificate: null,
    consentForm: null,
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("data", JSON.stringify(formData));

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      await api.post("/athletes/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Athlete Registered Successfully!");

      // Reset form
      setFormData({
        personal: { fullName: "", gender: "", dob: "", mobile: "", email: "" },
        guardian: { guardianName: "", relation: "", mobile: "", email: "" },
        address: { address: "", district: "", state: "", pinCode: "" },
        club: {
          clubName: "",
          coachName: "",
          coachMobile: "",
          stateAssociation: "",
        },
        competition: {
          competitionName: "",
          ageGroup: "",
          weightCategory: "",
          event: "",
        },
      });
      setFiles({
        passportPhoto: null,
        birthCertificate: null,
        medicalCertificate: null,
        consentForm: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (
    section,
    field,
    label,
    type = "text",
    options = null,
    required = false,
  ) => {
    const value = formData[section]?.[field] || "";

    if (type === "select" && options) {
      return (
        <div className="form-group">
          <label className="form-label">
            {label} {required && <span className="required">*</span>}
          </label>
          <select
            className="form-input"
            value={value}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div className="form-group full-width">
          <label className="form-label">
            {label} {required && <span className="required">*</span>}
          </label>
          <textarea
            className="form-input"
            value={value}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            rows="2"
            required={required}
          />
        </div>
      );
    }

    return (
      <div className="form-group">
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          type={type}
          className="form-input"
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          required={required}
        />
      </div>
    );
  };

  const renderFileUpload = (field, label, icon) => {
    return (
      <div className="form-group full-width">
        <label className="form-label">
          {icon} {label} <span className="required">*</span>
        </label>
        <div className="file-upload-wrapper">
          <input
            type="file"
            onChange={(e) => handleFileChange(field, e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            required={!files[field]}
          />
          <div className="file-upload-label">
            <span className="file-upload-icon">📤</span>
            <span className="file-upload-text">
              {files[field] ? (
                <span style={{ color: "#22c55e" }}>✅ {files[field].name}</span>
              ) : (
                <>
                  Click to upload <strong>{label}</strong>
                </>
              )}
            </span>
          </div>
        </div>
        {files[field] && (
          <div className="file-name">
            📎 {(files[field].size / 1024).toFixed(1)} KB
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        {/* Header */}
        <div className="registration-header">
          <div className="header-icon">🏃</div>
          <div>
            <h1 className="registration-title">Athlete Registration</h1>
            <p className="registration-subtitle">
              Complete all sections to register a new athlete
            </p>
          </div>
        </div>

        <form onSubmit={submit}>
          {/* Section 1: Personal Details */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">👤</span>
              <div>
                <h2 className="section-title">Personal Details</h2>
                <p className="section-subtitle">
                  Enter the athlete&apos;s personal information
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderField(
                "personal",
                "fullName",
                "Full Name",
                "text",
                null,
                true,
              )}
              {renderField(
                "personal",
                "gender",
                "Gender",
                "select",
                ["Male", "Female", "Other"],
                true,
              )}
              {renderField(
                "personal",
                "dob",
                "Date of Birth",
                "date",
                null,
                true,
              )}
              {renderField(
                "personal",
                "mobile",
                "Mobile Number",
                "tel",
                null,
                true,
              )}
              {renderField("personal", "email", "Email Address", "email")}
            </div>
          </section>

          {/* Section 2: Guardian Details */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">👨‍👩‍👧</span>
              <div>
                <h2 className="section-title">Guardian Details</h2>
                <p className="section-subtitle">
                  Provide guardian or parent information
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderField(
                "guardian",
                "guardianName",
                "Guardian Name",
                "text",
                null,
                true,
              )}
              {renderField(
                "guardian",
                "relation",
                "Relation",
                "select",
                ["Father", "Mother", "Guardian"],
                true,
              )}
              {renderField(
                "guardian",
                "mobile",
                "Mobile Number",
                "tel",
                null,
                true,
              )}
              {renderField("guardian", "email", "Email Address", "email")}
            </div>
          </section>

          {/* Section 3: Address Details */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">📍</span>
              <div>
                <h2 className="section-title">Address Details</h2>
                <p className="section-subtitle">
                  Enter the athlete&apos;s residential address
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderField(
                "address",
                "address",
                "Address",
                "textarea",
                null,
                true,
              )}
              {renderField(
                "address",
                "district",
                "District",
                "text",
                null,
                true,
              )}
              {renderField("address", "state", "State", "text", null, true)}
              {renderField(
                "address",
                "pinCode",
                "Pin Code",
                "text",
                null,
                true,
              )}
            </div>
          </section>

          {/* Section 4: Club Details */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">🏛️</span>
              <div>
                <h2 className="section-title">Club Details</h2>
                <p className="section-subtitle">
                  Information about the athlete&apos;s club
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderField("club", "clubName", "Club Name", "text", null, true)}
              {renderField(
                "club",
                "coachName",
                "Coach Name",
                "text",
                null,
                true,
              )}
              {renderField("club", "coachMobile", "Coach Mobile", "tel")}
              {renderField(
                "club",
                "stateAssociation",
                "State Association",
                "text",
              )}
            </div>
          </section>

          {/* Section 5: Competition Details */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">🏆</span>
              <div>
                <h2 className="section-title">Competition Details</h2>
                <p className="section-subtitle">
                  Enter competition-related information
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderField(
                "competition",
                "competitionName",
                "Competition Name",
                "text",
                null,
                true,
              )}
              {renderField(
                "competition",
                "ageGroup",
                "Age Group",
                "select",
                ["U-12", "U-14", "U-16", "U-18", "Open"],
                true,
              )}
              {renderField(
                "competition",
                "weightCategory",
                "Weight Category",
                "text",
              )}
              {renderField("competition", "event", "Event", "text", null, true)}
            </div>
          </section>

          {/* Section 6: Documents */}
          <section className="form-section">
            <div className="section-header">
              <span className="section-icon">📄</span>
              <div>
                <h2 className="section-title">Upload Documents</h2>
                <p className="section-subtitle">
                  Upload required documents (PDF, JPG, PNG formats)
                </p>
              </div>
            </div>
            <div className="form-grid">
              {renderFileUpload("passportPhoto", "Passport Photo", "📸")}
              {renderFileUpload("birthCertificate", "Birth Certificate", "📜")}
              {renderFileUpload(
                "medicalCertificate",
                "Medical Certificate",
                "🏥",
              )}
              {renderFileUpload("consentForm", "Consent Form", "📝")}
            </div>
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
