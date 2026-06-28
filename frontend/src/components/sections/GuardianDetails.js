import React from "react";
import FormField from "../common/FormField";

const GuardianDetails = ({
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

    if (field === "guardianName" && !value.trim()) {
      error = "Guardian name is required";
    }

    if (field === "relation" && !value) {
      error = "Relation is required";
    }

    if (field === "mobile") {
      if (!value) {
        error = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(value)) {
        error = "Mobile number must be 10 digits";
      }
    }

    if (field === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
    }

    setFieldError("guardian", field, error);
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
        <span className="section-icon">👨‍👩‍👧</span>
        <div>
          <h2 className="section-title">Guardian Details</h2>
          <p className="section-subtitle">
            Provide guardian or parent information
          </p>
        </div>
      </div>
      <div className="form-grid">
        <FormField
          section="guardian"
          field="guardianName"
          label="Guardian Name"
          type="text"
          value={formData.guardianName}
          error={errors.guardianName}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="guardian"
          field="relation"
          label="Relation"
          type="select"
          value={formData.relation}
          error={errors.relation}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          options={["Father", "Mother", "Guardian"]}
          required={true}
        />
        <FormField
          section="guardian"
          field="mobile"
          label="Mobile Number"
          type="tel"
          value={formData.mobile}
          error={errors.mobile}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="guardian"
          field="email"
          label="Email Address"
          type="email"
          value={formData.email}
          error={errors.email}
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

GuardianDetails.validate = (formData) => {
  const errors = {};

  if (!formData.guardianName.trim()) {
    errors.guardianName = "Guardian name is required";
  }

  if (!formData.relation) {
    errors.relation = "Relation is required";
  }

  if (!formData.mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  return errors;
};

export default GuardianDetails;
