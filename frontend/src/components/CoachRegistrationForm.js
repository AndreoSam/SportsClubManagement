"use client";

import { useState, useRef } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import CoachPersonalDetails from "./sections/CoachPersonalDetails";
import CoachAddressDetails from "./sections/CoachAddressDetails";
import CoachQualification from "./sections/CoachQualification";
import CoachExperience from "./sections/CoachExperience";
import CoachClubDetails from "./sections/CoachClubDetails";
import CoachDocumentUpload from "./sections/CoachDocumentUpload";
import PasswordSection from "./sections/PasswordSection";
import "./RegistrationForm.css";

export default function CoachRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      dob: "",
      gender: "",
      mobile: "",
      email: "",
    },
    address: {
      address: "",
      district: "",
      state: "",
      pinCode: "",
    },
    qualification: {
      highestQualification: "",
      coachingCertification: "",
      licenseNumber: "",
    },
    experience: {
      yearsOfExperience: "",
      previousClubs: "",
      sportsSpecialized: "",
    },
    club: {
      clubName: "",
      stateAssociation: "",
    },
    password: "",
    confirmPassword: "",
  });

  const [files, setFiles] = useState({
    passportPhoto: null,
    governmentId: null,
    coachingCertificate: null,
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const fileInputRefs = {
    passportPhoto: useRef(null),
    governmentId: useRef(null),
    coachingCertificate: useRef(null),
    resume: useRef(null),
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

    setFileErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (file) {
      let error = "";
      const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
      const MAX_PDF_SIZE = 2 * 1024 * 1024;
      const MAX_SIZE = field === "resume" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
      const ALLOWED_TYPES =
        field === "resume" ? ["application/pdf"] : ["image/jpeg", "image/jpg", "image/png"];

      if (!ALLOWED_TYPES.includes(file.type)) {
        error = field === "resume" ? "Only PDF files allowed" : "Only JPG, PNG files allowed";
      } else if (file.size > MAX_SIZE) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const limit = field === "resume" ? "2MB" : "1MB";
        error = `File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${limit}`;
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

  const validateForm = () => {
    let isValid = true;

    const allTouched = {};
    const sections = ["personal", "address", "qualification", "experience", "club"];
    const requiredFields = {
      personal: ["fullName", "dob", "gender", "mobile", "email"],
      address: ["address", "district", "state", "pinCode"],
      qualification: ["highestQualification", "coachingCertification", "licenseNumber"],
      experience: ["yearsOfExperience", "previousClubs", "sportsSpecialized"],
      club: ["clubName", "stateAssociation"],
    };

    sections.forEach((section) => {
      requiredFields[section].forEach((field) => {
        allTouched[`${section}.${field}`] = true;
      });
    });
    setTouched(allTouched);

    const personalErrors = CoachPersonalDetails.validate(formData.personal);
    const addressErrors = CoachAddressDetails.validate(formData.address);
    const qualificationErrors = CoachQualification.validate(formData.qualification);
    const experienceErrors = CoachExperience.validate(formData.experience);
    const clubErrors = CoachClubDetails.validate(formData.club);
    const documentErrors = CoachDocumentUpload.validate(files);
    const passErrors = PasswordSection.validate(formData.password, formData.confirmPassword);

    const newErrors = {};
    if (Object.keys(personalErrors).length > 0) {
      newErrors.personal = personalErrors;
      isValid = false;
    }
    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
      isValid = false;
    }
    if (Object.keys(qualificationErrors).length > 0) {
      newErrors.qualification = qualificationErrors;
      isValid = false;
    }
    if (Object.keys(experienceErrors).length > 0) {
      newErrors.experience = experienceErrors;
      isValid = false;
    }
    if (Object.keys(clubErrors).length > 0) {
      newErrors.club = clubErrors;
      isValid = false;
    }
    if (Object.keys(passErrors).length > 0) {
      setPasswordErrors(passErrors);
      isValid = false;
    }

    setErrors(newErrors);
    setFileErrors(documentErrors);

    return isValid && Object.keys(documentErrors).length === 0;
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

      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP Sent");
      }
    } catch (err) {
      console.error("Error:", err);

      if (err.response?.status === 409) {
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

      await api.post("/coaches/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Coach Registered Successfully!");

      setFormData({
        personal: { fullName: "", dob: "", gender: "", mobile: "", email: "" },
        address: { address: "", district: "", state: "", pinCode: "" },
        qualification: {
          highestQualification: "",
          coachingCertification: "",
          licenseNumber: "",
        },
        experience: {
          yearsOfExperience: "",
          previousClubs: "",
          sportsSpecialized: "",
        },
        club: { clubName: "", stateAssociation: "" },
        password: "",
        confirmPassword: "",
      });
      setFiles({
        passportPhoto: null,
        governmentId: null,
        coachingCertificate: null,
        resume: null,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <div className="header-icon">👨‍🏫</div>
          <div>
            <h1 className="registration-title">Coach Registration</h1>
            <p className="registration-subtitle">
              Complete all sections to register as a coach
            </p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <CoachPersonalDetails
            formData={formData.personal}
            errors={errors.personal || {}}
            touched={touched}
            submitAttempted={submitAttempted}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
            otp={otp}
            otpSent={otpSent}
            emailVerified={emailVerified}
            onOtpChange={setOtp}
            isSendingOTP={isSendingOTP}
            onSendOTP={sendOTP}
            onVerifyOTP={verifyOTP}
          />

          <CoachAddressDetails
            formData={formData.address}
            errors={errors.address || {}}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
          />

          <CoachQualification
            formData={formData.qualification}
            errors={errors.qualification || {}}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
          />

          <CoachExperience
            formData={formData.experience}
            errors={errors.experience || {}}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
          />

          <CoachClubDetails
            formData={formData.club}
            errors={errors.club || {}}
            touched={touched}
            onInputChange={handleInputChange}
            onBlur={handleBlur}
          />

          <CoachDocumentUpload
            files={files}
            fileErrors={fileErrors}
            fileInputRefs={fileInputRefs}
            onFileChange={handleFileChange}
            onFileClick={handleFileClick}
            emailVerified={emailVerified}
          />

          <PasswordSection
            password={formData.password}
            confirmPassword={formData.confirmPassword}
            errors={passwordErrors}
            touched={touched}
            onPasswordChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
            onConfirmPasswordChange={(value) => setFormData((prev) => ({ ...prev, confirmPassword: value }))}
            onBlur={() => {}}
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
