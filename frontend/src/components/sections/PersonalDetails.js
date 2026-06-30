import React from "react";
import FormField from "../common/FormField";

const PersonalDetails = ({
  formData,
  errors,
  touched,
  submitAttempted,
  onInputChange,
  onBlur,
  setFieldError,

  otp,
  otpSent,
  emailVerified,
  onOtpChange,
  onSendOTP,
  onVerifyOTP,
  isSendingOTP = false,
  isVerifyingOTP = false,
  otpError = "",
}) => {
  const validateField = (field, value) => {
    let error = "";

    if (field === "fullName") {
      if (!value.trim()) {
        error = "Full name is required";
      } else if (value.trim().length < 2) {
        error = "Full name must be at least 2 characters";
      }
    }

    if (field === "gender" && !value) {
      error = "Gender is required";
    }

    if (field === "dob") {
      if (!value) {
        error = "Date of birth is required";
      } else {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 5) {
          error = "Athlete must be at least 5 years old";
        } else if (age > 80) {
          error = "Invalid date of birth";
        }
      }
    }

    if (field === "mobile") {
      if (!value) {
        error = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(value)) {
        error = "Mobile number must be 10 digits";
      }
    }

    if (field === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
    }

    if (setFieldError) {
      setFieldError("personal", field, error);
    }
    return error;
  };

  const handleFieldBlur = (section, field) => {
    if (onBlur) {
      onBlur(section, field);
    }
    validateField(field, formData[field]);
  };

  const handleFieldChange = (section, field, value) => {
    if (onInputChange) {
      onInputChange(section, field, value);
    }
    validateField(field, value);
  };

  const hasEmailError = errors?.email || false;
  const isEmailValid = formData?.email && !hasEmailError;

  return (
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
        <FormField
          section="personal"
          field="fullName"
          label="Full Name"
          type="text"
          value={formData?.fullName || ""}
          error={errors?.fullName || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="personal"
          field="gender"
          label="Gender"
          type="select"
          value={formData?.gender || ""}
          error={errors?.gender || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          options={["Male", "Female", "Other"]}
          required={true}
        />
        <FormField
          section="personal"
          field="dob"
          label="Date of Birth"
          type="date"
          value={formData?.dob || ""}
          error={errors?.dob || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="personal"
          field="mobile"
          label="Mobile Number"
          type="tel"
          value={formData?.mobile || ""}
          error={errors?.mobile || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />

        {/* Email Field with OTP Verification */}
        <div className="form-group email-verification-group">
          <label className="form-label">
            Email Address <span className="required">*</span>
          </label>

          <div className="email-input-wrapper">
            <input
              type="email"
              className={`form-input ${hasEmailError ? "error" : ""}`}
              value={formData?.email || ""}
              onChange={(e) =>
                handleFieldChange("personal", "email", e.target.value)
              }
              onBlur={() => handleFieldBlur("personal", "email")}
              placeholder="Enter email address"
              disabled={emailVerified}
            />

            {/* Show Send OTP button ONLY before OTP is sent */}
            {!otpSent && !emailVerified && (
              <button
                type="button"
                className="otp-btn send-otp-btn"
                onClick={onSendOTP}
                disabled={!isEmailValid || isSendingOTP}
              >
                {isSendingOTP ? (
                  <>
                    <span className="spinner-small"></span>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            )}

            {/* Verified Badge */}
            {emailVerified && (
              <span className="verified-badge">
                <span className="verified-icon">✅</span>
                Verified
              </span>
            )}
          </div>

          {hasEmailError && (
            <span className="error-message">{errors?.email}</span>
          )}

          {otpError && !emailVerified && (
            <span className="error-message">{otpError}</span>
          )}
        </div>

        {/* OTP Verification Section */}
        {otpSent && !emailVerified && (
          <div className="form-group otp-verification-group full-width">
            <div className="otp-wrapper">
              <div className="otp-input-wrapper">
                <input
                  type="text"
                  className="otp-input"
                  value={otp || ""}
                  onChange={(e) => onOtpChange(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  autoFocus
                />

                <button
                  type="button"
                  className="otp-btn verify-otp-btn"
                  onClick={onVerifyOTP}
                  disabled={!otp || otp.length !== 6 || isVerifyingOTP}
                >
                  {isVerifyingOTP ? (
                    <>
                      <span className="spinner-small"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>

              <div className="otp-help-text">
                <p>
                  OTP has been sent to <strong>{formData?.email}</strong>
                </p>
                <button
                  type="button"
                  className="resend-otp-link"
                  onClick={onSendOTP}
                  disabled={isSendingOTP}
                >
                  {isSendingOTP ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Static validation method for form-level validation
PersonalDetails.validate = (formData) => {
  const errors = {};

  if (!formData?.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!formData?.gender) {
    errors.gender = "Gender is required";
  }

  if (!formData?.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
    if (age < 5) {
      errors.dob = "Athlete must be at least 5 years old";
    } else if (age > 80) {
      errors.dob = "Invalid date of birth";
    }
  }

  if (!formData?.mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (!formData?.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  return errors;
};

export default PersonalDetails;
