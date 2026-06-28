"use client";

import { useState, useRef } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import PersonalDetails from "./sections/PersonalDetails";
import GuardianDetails from "./sections/GuardianDetails";
import AddressDetails from "./sections/AddressDetails";
import ClubDetails from "./sections/ClubDetails";
import CompetitionDetails from "./sections/CompetitionDetails";
import DocumentUpload from "./sections/DocumentUpload";
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

  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const fileInputRefs = {
    passportPhoto: useRef(null),
    birthCertificate: useRef(null),
    medicalCertificate: useRef(null),
    consentForm: useRef(null),
  };

  const handleInputChange = (section, field, value) => {
    if (section === "personal" && field === "email") {
      setEmailVerified(false);
      setOtp("");
      setOtpSent(false);
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: "",
      },
    }));

    setTouched((prev) => ({
      ...prev,
      [`${section}.${field}`]: true,
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Clear previous file error
    setFileErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    // Validate file immediately
    if (file) {
      let error = "";
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      const ALLOWED_FILE_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        error = "Only JPG, PNG, and PDF files are allowed";
      } else if (file.size > MAX_FILE_SIZE) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        error = `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of 5MB`;
      }

      if (error) {
        setFileErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    }
  };

  const handleFileClick = (field) => {
    if (fileInputRefs[field] && fileInputRefs[field].current) {
      fileInputRefs[field].current.click();
    }
  };

  const handleBlur = (section, field) => {
    setTouched((prev) => ({
      ...prev,
      [`${section}.${field}`]: true,
    }));
  };

  const setFieldError = (section, field, error) => {
    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: error,
      },
    }));
  };

  const setFileFieldError = (field, error) => {
    setFileErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = () => {
    let isValid = true;

    // Mark all fields as touched
    const allTouched = {};
    const sections = ["personal", "guardian", "address", "club", "competition"];
    const requiredFields = {
      personal: ["fullName", "gender", "dob", "mobile", "email"],
      guardian: ["guardianName", "relation", "mobile", "email"],
      address: ["address", "district", "state", "pinCode"],
      club: ["clubName", "coachName", "coachMobile", "stateAssociation"],
      competition: ["competitionName", "ageGroup", "weightCategory", "event"],
    };

    sections.forEach((section) => {
      requiredFields[section].forEach((field) => {
        allTouched[`${section}.${field}`] = true;
      });
    });
    setTouched(allTouched);

    // Validate all sections
    const personalErrors = PersonalDetails.validate(formData.personal);
    const guardianErrors = GuardianDetails.validate(formData.guardian);
    const addressErrors = AddressDetails.validate(formData.address);
    const clubErrors = ClubDetails.validate(formData.club);
    const competitionErrors = CompetitionDetails.validate(formData.competition);
    const documentErrors = DocumentUpload.validate(files);

    // Merge errors
    const newErrors = {};
    if (Object.keys(personalErrors).length > 0) {
      newErrors.personal = personalErrors;
      isValid = false;
    }
    if (Object.keys(guardianErrors).length > 0) {
      newErrors.guardian = guardianErrors;
      isValid = false;
    }
    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
      isValid = false;
    }
    if (Object.keys(clubErrors).length > 0) {
      newErrors.club = clubErrors;
      isValid = false;
    }
    if (Object.keys(competitionErrors).length > 0) {
      newErrors.competition = competitionErrors;
      isValid = false;
    }

    setErrors(newErrors);
    setFileErrors(documentErrors);

    return isValid;
  };

  const sendOTP = async () => {
    if (!formData.personal.email) {
      toast.error("Enter Email");
      return;
    }

    try {
      setIsSendingOTP(true);

      const res = await api.post("/auth/send-email-otp", {
        email: formData.personal.email,
      });

      console.log("OTP response:", res.data);

      setOtpSent(true);
      toast.success("OTP Sent");
    } catch (err) {
      console.log(err);

      if (err.code === "ECONNABORTED") {
        toast.error("Request timeout. Check your internet or API URL.");
      } else if (err.response?.status === 409) {
        toast.error("Email already registered");
      } else if (!err.response) {
        toast.error("Cannot reach server. Check NEXT_PUBLIC_API_URL.");
      } else {
        toast.error(err.response?.data?.message || "Unable to send OTP");
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-email-otp", {
        email: formData.personal.email,
        otp,
      });

      if (res.data.success) {
        setEmailVerified(true);
        toast.success("Email Verified");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setIsSubmitting(true);

    if (!emailVerified) {
      toast.error("Please verify your email before submitting.");
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      setIsSubmitting(false);
      return;
    }

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
      setErrors({});
      setFileErrors({});
      setTouched({});
      setSubmitAttempted(false);
      setOtp("");
      setOtpSent(false);
      setEmailVerified(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission Failed");
      // if (err.response?.status === 409) {
      //   alert(err.response.data.message);
      //   return;
      // }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <div className="header-icon">🏃</div>
          <div>
            <h1 className="registration-title">Athlete Registration</h1>
            <p className="registration-subtitle">
              Complete all sections to register a new athlete
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <PersonalDetails
            formData={formData.personal}
            errors={errors.personal || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            setFieldError={setFieldError}
            otp={otp}
            otpSent={otpSent}
            emailVerified={emailVerified}
            onOtpChange={setOtp}
            isSendingOTP={isSendingOTP}
            onSendOTP={sendOTP}
            onVerifyOTP={verifyOTP}
          />

          <GuardianDetails
            formData={formData.guardian}
            errors={errors.guardian || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            setFieldError={setFieldError}
          />

          <AddressDetails
            formData={formData.address}
            errors={errors.address || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            setFieldError={setFieldError}
          />

          <ClubDetails
            formData={formData.club}
            errors={errors.club || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            setFieldError={setFieldError}
          />

          <CompetitionDetails
            formData={formData.competition}
            errors={errors.competition || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            setFieldError={setFieldError}
          />

          <DocumentUpload
            files={files}
            fileErrors={fileErrors}
            fileInputRefs={fileInputRefs}
            onFileChange={handleFileChange}
            onFileClick={handleFileClick}
            setFileFieldError={setFileFieldError}
            emailVerified={emailVerified}
          />

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
