import React from "react";
import FormField from "../common/FormField";

const AddressDetails = ({
  formData,
  errors,
  touched,
  submitAttempted,
  onInputChange,
  onBlur,
  setFieldError,
}) => {
  const validateField = (field, value) => {
    let error = "";

    if (field === "address" && !value.trim()) {
      error = "Address is required";
    }

    if (field === "district" && !value.trim()) {
      error = "District is required";
    }

    if (field === "state" && !value.trim()) {
      error = "State is required";
    }

    if (field === "pinCode") {
      if (!value) {
        error = "Pin code is required";
      } else if (!/^[0-9]{5,6}$/.test(value)) {
        error = "Pin code must be 5 or 6 digits";
      }
    }

    setFieldError("address", field, error);
    return error;
  };

  const handleFieldBlur = (section, field) => {
    onBlur(section, field);
    validateField(field, formData[field]);
  };

  const handleFieldChange = (section, field, value) => {
    onInputChange(section, field, value);
    validateField(field, value);
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-icon">📍</span>
        <div>
          <h2 className="section-title">Address Details</h2>
          <p className="section-subtitle">
            Enter the athlete&apos;s residential address
          </p>
        </div>
      </div>
      <div className="form-grid">
        <FormField
          section="address"
          field="address"
          label="Address"
          type="textarea"
          value={formData.address}
          error={errors.address}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="address"
          field="district"
          label="District"
          type="text"
          value={formData.district}
          error={errors.district}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="address"
          field="state"
          label="State"
          type="text"
          value={formData.state}
          error={errors.state}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="address"
          field="pinCode"
          label="Pin Code"
          type="text"
          value={formData.pinCode}
          error={errors.pinCode}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
      </div>
    </section>
  );
};

AddressDetails.validate = (formData) => {
  const errors = {};

  if (!formData.address.trim()) {
    errors.address = "Address is required";
  }

  if (!formData.district.trim()) {
    errors.district = "District is required";
  }

  if (!formData.state.trim()) {
    errors.state = "State is required";
  }

  if (!formData.pinCode) {
    errors.pinCode = "Pin code is required";
  } else if (!/^[0-9]{5,6}$/.test(formData.pinCode)) {
    errors.pinCode = "Pin code must be 5 or 6 digits";
  }

  return errors;
};

export default AddressDetails;
