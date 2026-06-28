import React from "react";
import FormField from "../common/FormField";

const CompetitionDetails = ({
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

    if (field === "competitionName" && !value.trim()) {
      error = "Competition name is required";
    }

    if (field === "ageGroup" && !value) {
      error = "Age group is required";
    }

    if (field === "weightCategory" && !value.trim()) {
      error = "Weight category is required";
    }

    if (field === "event" && !value.trim()) {
      error = "Event is required";
    }

    setFieldError("competition", field, error);
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
        <span className="section-icon">🏆</span>
        <div>
          <h2 className="section-title">Competition Details</h2>
          <p className="section-subtitle">
            Enter competition-related information
          </p>
        </div>
      </div>
      <div className="form-grid">
        <FormField
          section="competition"
          field="competitionName"
          label="Competition Name"
          type="text"
          value={formData.competitionName}
          error={errors.competitionName}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="competition"
          field="ageGroup"
          label="Age Group"
          type="select"
          value={formData.ageGroup}
          error={errors.ageGroup}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          options={["U-12", "U-14", "U-16", "U-18", "Open"]}
          required={true}
        />
        <FormField
          section="competition"
          field="weightCategory"
          label="Weight Category"
          type="text"
          value={formData.weightCategory}
          error={errors.weightCategory}
          touched={touched}
          submitAttempted={submitAttempted}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="competition"
          field="event"
          label="Event"
          type="text"
          value={formData.event}
          error={errors.event}
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

CompetitionDetails.validate = (formData) => {
  const errors = {};

  if (!formData.competitionName.trim()) {
    errors.competitionName = "Competition name is required";
  }

  if (!formData.ageGroup) {
    errors.ageGroup = "Age group is required";
  }

  if (!formData.weightCategory.trim()) {
    errors.weightCategory = "Weight category is required";
  }

  if (!formData.event.trim()) {
    errors.event = "Event is required";
  }

  return errors;
};

export default CompetitionDetails;
