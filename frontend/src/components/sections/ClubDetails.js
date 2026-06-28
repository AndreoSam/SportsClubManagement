import React from "react";
import FormField from "../common/FormField";

const ClubDetails = ({
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

    if (field === "clubName" && !value.trim()) {
      error = "Club name is required";
    }

    if (field === "coachName" && !value.trim()) {
      error = "Coach name is required";
    }

    if (field === "coachMobile") {
      if (!value) {
        error = "Coach mobile number is required";
      } else if (!/^[0-9]{10}$/.test(value)) {
        error = "Mobile number must be 10 digits";
      }
    }

    if (field === "stateAssociation") {
      if (!value.trim()) {
        error = "State association is required";
      } else if (value.trim().length < 2) {
        error = "State association must be at least 2 characters";
      }
    }

    setFieldError("club", field, error);
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
        <span className="section-icon">🏛️</span>
        <div>
          <h2 className="section-title">Club Details</h2>
          <p className="section-subtitle">
            Information about the athlete&apos;s club
          </p>
        </div>
      </div>
      <div className="form-grid">
        <FormField
          section="club"
          field="clubName"
          label="Club Name"
          type="text"
          value={formData.clubName}
          error={errors.clubName}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="club"
          field="coachName"
          label="Coach Name"
          type="text"
          value={formData.coachName}
          error={errors.coachName}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="club"
          field="coachMobile"
          label="Coach Mobile"
          type="tel"
          value={formData.coachMobile}
          error={errors.coachMobile}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="club"
          field="stateAssociation"
          label="State Association"
          type="text"
          value={formData.stateAssociation}
          error={errors.stateAssociation}
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

ClubDetails.validate = (formData) => {
  const errors = {};

  if (!formData.clubName.trim()) {
    errors.clubName = "Club name is required";
  }

  if (!formData.coachName.trim()) {
    errors.coachName = "Coach name is required";
  }

  if (!formData.coachMobile) {
    errors.coachMobile = "Coach mobile number is required";
  } else if (!/^[0-9]{10}$/.test(formData.coachMobile)) {
    errors.coachMobile = "Mobile number must be 10 digits";
  }

  if (!formData.stateAssociation.trim()) {
    errors.stateAssociation = "State association is required";
  } else if (formData.stateAssociation.trim().length < 2) {
    errors.stateAssociation = "State association must be at least 2 characters";
  }

  return errors;
};

export default ClubDetails;
