"use client";

export default function CoachQualification({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}) {
  const getError = (field) => {
    const key = `qualification.${field}`;
    return touched[key] ? errors[field] : "";
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Qualifications</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Highest Qualification *</label>
          <input
            type="text"
            value={formData.highestQualification}
            onChange={(e) =>
              onInputChange("qualification", "highestQualification", e.target.value)
            }
            onBlur={() => onBlur("qualification", "highestQualification")}
            placeholder="E.g., Bachelor's, Master's, etc."
            className={getError("highestQualification") ? "input-error" : ""}
          />
          {getError("highestQualification") && (
            <span className="error-text">{getError("highestQualification")}</span>
          )}
        </div>

        <div className="form-group">
          <label>Coaching Certification *</label>
          <input
            type="text"
            value={formData.coachingCertification}
            onChange={(e) =>
              onInputChange("qualification", "coachingCertification", e.target.value)
            }
            onBlur={() => onBlur("qualification", "coachingCertification")}
            placeholder="E.g., Level 1, Level 2, etc."
            className={getError("coachingCertification") ? "input-error" : ""}
          />
          {getError("coachingCertification") && (
            <span className="error-text">{getError("coachingCertification")}</span>
          )}
        </div>

        <div className="form-group">
          <label>Coaching License Number *</label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) =>
              onInputChange("qualification", "licenseNumber", e.target.value)
            }
            onBlur={() => onBlur("qualification", "licenseNumber")}
            placeholder="Enter license number"
            className={getError("licenseNumber") ? "input-error" : ""}
          />
          {getError("licenseNumber") && (
            <span className="error-text">{getError("licenseNumber")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

CoachQualification.validate = (data) => {
  const errors = {};

  if (!data.highestQualification?.trim()) {
    errors.highestQualification = "Highest qualification is required";
  }

  if (!data.coachingCertification?.trim()) {
    errors.coachingCertification = "Coaching certification is required";
  }

  if (!data.licenseNumber?.trim()) {
    errors.licenseNumber = "License number is required";
  }

  return errors;
};
