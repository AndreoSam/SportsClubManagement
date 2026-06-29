"use client";

export default function CoachPersonalDetails({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  otp,
  otpSent,
  emailVerified,
  onOtpChange,
  isSendingOTP,
  onSendOTP,
  onVerifyOTP,
}) {
  const getError = (field) => {
    const key = `personal.${field}`;
    return touched[key] ? errors[field] : "";
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Personal Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onInputChange("personal", "fullName", e.target.value)}
            onBlur={() => onBlur("personal", "fullName")}
            placeholder="Enter full name"
            className={getError("fullName") ? "input-error" : ""}
          />
          {getError("fullName") && (
            <span className="error-text">{getError("fullName")}</span>
          )}
        </div>

        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => onInputChange("personal", "dob", e.target.value)}
            onBlur={() => onBlur("personal", "dob")}
            className={getError("dob") ? "input-error" : ""}
          />
          {getError("dob") && (
            <span className="error-text">{getError("dob")}</span>
          )}
        </div>

        <div className="form-group">
          <label>Gender *</label>
          <select
            value={formData.gender}
            onChange={(e) => onInputChange("personal", "gender", e.target.value)}
            onBlur={() => onBlur("personal", "gender")}
            className={getError("gender") ? "input-error" : ""}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {getError("gender") && (
            <span className="error-text">{getError("gender")}</span>
          )}
        </div>

        <div className="form-group">
          <label>Mobile *</label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => onInputChange("personal", "mobile", e.target.value)}
            onBlur={() => onBlur("personal", "mobile")}
            placeholder="Enter mobile number"
            className={getError("mobile") ? "input-error" : ""}
          />
          {getError("mobile") && (
            <span className="error-text">{getError("mobile")}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label>Email *</label>
          <div className="email-input-wrapper">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("personal", "email", e.target.value)}
              onBlur={() => onBlur("personal", "email")}
              placeholder="Enter email"
              disabled={emailVerified}
              className={getError("email") ? "input-error" : ""}
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={onSendOTP}
                disabled={!formData.email || isSendingOTP}
                className="otp-btn"
              >
                {isSendingOTP ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            )}
          </div>
          {getError("email") && (
            <span className="error-text">{getError("email")}</span>
          )}
        </div>

        {otpSent && !emailVerified && (
          <div className="form-group full-width">
            <label>Enter OTP *</label>
            <div className="otp-input-wrapper">
              <input
                type="text"
                value={otp}
                onChange={(e) => onOtpChange(e.target.value)}
                placeholder="Enter OTP"
                maxLength="6"
                className="otp-input"
              />
              <button
                type="button"
                onClick={onVerifyOTP}
                disabled={!otp}
                className="verify-btn"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {emailVerified && (
          <div className="form-group full-width">
            <span className="verified-badge">✓ Email Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}

CoachPersonalDetails.validate = (data) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.dob) {
    errors.dob = "Date of birth is required";
  }

  if (!data.gender) {
    errors.gender = "Gender is required";
  }

  if (!data.mobile?.trim()) {
    errors.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(data.mobile.replace(/\D/g, ""))) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  return errors;
};
