"use client";

export default function CoachClubDetails({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}) {
  const getError = (field) => {
    const key = `club.${field}`;
    return touched[key] ? errors[field] : "";
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Club Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Club Name *</label>
          <input
            type="text"
            value={formData.clubName}
            onChange={(e) => onInputChange("club", "clubName", e.target.value)}
            onBlur={() => onBlur("club", "clubName")}
            placeholder="Enter club name"
            className={getError("clubName") ? "input-error" : ""}
          />
          {getError("clubName") && (
            <span className="error-text">{getError("clubName")}</span>
          )}
        </div>

        <div className="form-group">
          <label>State Association *</label>
          <input
            type="text"
            value={formData.stateAssociation}
            onChange={(e) =>
              onInputChange("club", "stateAssociation", e.target.value)
            }
            onBlur={() => onBlur("club", "stateAssociation")}
            placeholder="Enter state association"
            className={getError("stateAssociation") ? "input-error" : ""}
          />
          {getError("stateAssociation") && (
            <span className="error-text">{getError("stateAssociation")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

CoachClubDetails.validate = (data) => {
  const errors = {};

  if (!data.clubName?.trim()) {
    errors.clubName = "Club name is required";
  }

  if (!data.stateAssociation?.trim()) {
    errors.stateAssociation = "State association is required";
  }

  return errors;
};
