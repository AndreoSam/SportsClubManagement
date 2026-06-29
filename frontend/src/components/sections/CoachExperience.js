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
      <h2 className="section-title">Experience</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Years of Experience *</label>
          <input
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              onInputChange("experience", "yearsOfExperience", e.target.value)
            }
            onBlur={() => onBlur("experience", "yearsOfExperience")}
            placeholder="Enter years of experience"
            min="0"
            className={getError("yearsOfExperience") ? "input-error" : ""}
          />
          {getError("yearsOfExperience") && (
            <span className="error-text">{getError("yearsOfExperience")}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label>Previous Clubs *</label>
          <input
            type="text"
            value={formData.previousClubs}
            onChange={(e) => onInputChange("experience", "previousClubs", e.target.value)}
            onBlur={() => onBlur("experience", "previousClubs")}
            placeholder="List clubs you've coached in (comma-separated)"
            className={getError("previousClubs") ? "input-error" : ""}
          />
          {getError("previousClubs") && (
            <span className="error-text">{getError("previousClubs")}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label>Sports Specialized In *</label>
          <input
            type="text"
            value={formData.sportsSpecialized}
            onChange={(e) =>
              onInputChange("experience", "sportsSpecialized", e.target.value)
            }
            onBlur={() => onBlur("experience", "sportsSpecialized")}
            placeholder="E.g., Cricket, Football, etc."
            className={getError("sportsSpecialized") ? "input-error" : ""}
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
