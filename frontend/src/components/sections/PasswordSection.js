"use client";

import { useState } from "react";

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
      <h2 className="section-title">Create Password</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={() => onBlur("password")}
              placeholder="Enter password (min 8 characters)"
              className={errors.password ? "input-error" : ""}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
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
          <label>Confirm Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              onBlur={() => onBlur("confirmPassword")}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? "input-error" : ""}
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
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
