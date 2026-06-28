import React from "react";

const FormField = ({
  section,
  field,
  label,
  type = "text",
  value,
  error,
  touched = {},
  submitAttempted = false,
  options = null,
  onInputChange,
  onBlur,
  required = false,
}) => {
  // Safely check if field is touched
  const isTouched = touched[`${section}.${field}`] || submitAttempted;
  const hasError = isTouched && error;

  const handleChange = (e) => {
    onInputChange(section, field, e.target.value);
  };

  const handleBlurField = () => {
    if (onBlur) {
      onBlur(section, field);
    }
  };

  if (type === "select" && options) {
    return (
      <div className="form-group">
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
        <select
          className={`form-input ${hasError ? "error" : ""}`}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlurField}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {hasError && <span className="error-message">{error}</span>}
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
          className={`form-input ${hasError ? "error" : ""}`}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlurField}
          placeholder={`Enter ${label.toLowerCase()}`}
          rows="2"
        />
        {hasError && <span className="error-message">{error}</span>}
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
        className={`form-input ${hasError ? "error" : ""}`}
        value={value || ""}
        onChange={handleChange}
        onBlur={handleBlurField}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {hasError && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormField;
