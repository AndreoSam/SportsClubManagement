"use client";

export default function CoachExperience({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}) {
  const getError = (field) => {
    const key = `experience.${field}`;
    return touched[key] ? errors[field] : "";
  };

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-icon">⭐</div>
        <div>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">Your coaching journey</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Years of Experience <span className="required">*</span></label>
          <input
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              onInputChange("experience", "yearsOfExperience", e.target.value)
            }
            onBlur={() => onBlur("experience", "yearsOfExperience")}
            placeholder="Enter years of experience"
            min="0"
            className={`form-input ${getError("yearsOfExperience") ? "input-error" : ""}`}
          />
          {getError("yearsOfExperience") && (
            <span className="error-text">{getError("yearsOfExperience")}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label className="form-label">Previous Clubs <span className="required">*</span></label>
          <input
            type="text"
            value={formData.previousClubs}
            onChange={(e) => onInputChange("experience", "previousClubs", e.target.value)}
            onBlur={() => onBlur("experience", "previousClubs")}
            placeholder="List clubs you've coached in (comma-separated)"
            className={`form-input ${getError("previousClubs") ? "input-error" : ""}`}
          />
          {getError("previousClubs") && (
            <span className="error-text">{getError("previousClubs")}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label className="form-label">Sports Specialized In <span className="required">*</span></label>
          <input
            type="text"
            value={formData.sportsSpecialized}
            onChange={(e) =>
              onInputChange("experience", "sportsSpecialized", e.target.value)
            }
            onBlur={() => onBlur("experience", "sportsSpecialized")}
            placeholder="E.g., Cricket, Football, etc."
            className={`form-input ${getError("sportsSpecialized") ? "input-error" : ""}`}
          />
          {getError("sportsSpecialized") && (
            <span className="error-text">{getError("sportsSpecialized")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

CoachExperience.validate = (data) => {
  const errors = {};

  if (data.yearsOfExperience === "" || data.yearsOfExperience === null) {
    errors.yearsOfExperience = "Years of experience is required";
  } else if (isNaN(data.yearsOfExperience) || data.yearsOfExperience < 0) {
    errors.yearsOfExperience = "Enter a valid number";
  }

  if (!data.previousClubs?.trim()) {
    errors.previousClubs = "Previous clubs are required";
  }

  if (!data.sportsSpecialized?.trim()) {
    errors.sportsSpecialized = "Sports specialized in is required";
  }

  return errors;
};
