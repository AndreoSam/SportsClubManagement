"use client";

import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function PasswordSection({
  password,
  confirmPassword,
  errors,
  touched,
  onPasswordChange,
  onConfirmPasswordChange,
  onBlur,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">🔐</div>
        <div>
          <h2 className="section-title">Create Password</h2>
          <p className="section-subtitle">
            Secure your account with a strong password
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">
            Password <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={() => onBlur("password")}
              placeholder="Enter password (min 8 characters)"
              className={`form-input ${errors.password ? "input-error" : ""}`}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
          <p className="password-hint">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="form-group full-width">
          <label className="form-label">
            Confirm Password <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              onBlur={() => onBlur("confirmPassword")}
              placeholder="Re-enter your password"
              className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>
      </div>
    </div>
  );
}

PasswordSection.validate = (password, confirmPassword) => {
  const errors = {};

  if (!password || password.trim() === "") {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
