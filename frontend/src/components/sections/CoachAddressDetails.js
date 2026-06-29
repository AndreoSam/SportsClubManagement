"use client";

export default function CoachAddressDetails({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}) {
  const getError = (field) => {
    const key = `address.${field}`;
    return touched[key] ? errors[field] : "";
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Address Details</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onInputChange("address", "address", e.target.value)}
            onBlur={() => onBlur("address", "address")}
            placeholder="Enter full address"
            className={getError("address") ? "input-error" : ""}
          />
          {getError("address") && (
            <span className="error-text">{getError("address")}</span>
          )}
        </div>

        <div className="form-group">
          <label>District *</label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => onInputChange("address", "district", e.target.value)}
            onBlur={() => onBlur("address", "district")}
            placeholder="Enter district"
            className={getError("district") ? "input-error" : ""}
          />
          {getError("district") && (
            <span className="error-text">{getError("district")}</span>
          )}
        </div>

        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onInputChange("address", "state", e.target.value)}
            onBlur={() => onBlur("address", "state")}
            placeholder="Enter state"
            className={getError("state") ? "input-error" : ""}
          />
          {getError("state") && (
            <span className="error-text">{getError("state")}</span>
          )}
        </div>

        <div className="form-group">
          <label>PIN Code *</label>
          <input
            type="text"
            value={formData.pinCode}
            onChange={(e) => onInputChange("address", "pinCode", e.target.value)}
            onBlur={() => onBlur("address", "pinCode")}
            placeholder="Enter PIN code"
            className={getError("pinCode") ? "input-error" : ""}
          />
          {getError("pinCode") && (
            <span className="error-text">{getError("pinCode")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

CoachAddressDetails.validate = (data) => {
  const errors = {};

  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!data.district?.trim()) {
    errors.district = "District is required";
  }

  if (!data.state?.trim()) {
    errors.state = "State is required";
  }

  if (!data.pinCode?.trim()) {
    errors.pinCode = "PIN code is required";
  } else if (!/^\d{6}$/.test(data.pinCode.replace(/\D/g, ""))) {
    errors.pinCode = "PIN code must be 6 digits";
  }

  return errors;
};
