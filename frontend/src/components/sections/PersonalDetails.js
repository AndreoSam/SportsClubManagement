import React from "react";
import FormField from "../common/FormField";

const PersonalDetails = ({
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

    if (field === "fullName") {
      if (!value.trim()) {
        error = "Full name is required";
      } else if (value.trim().length < 2) {
        error = "Full name must be at least 2 characters";
      }
    }

    if (field === "gender" && !value) {
      error = "Gender is required";
    }

    if (field === "dob") {
      if (!value) {
        error = "Date of birth is required";
      } else {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 5) {
          error = "Athlete must be at least 5 years old";
        } else if (age > 80) {
          error = "Invalid date of birth";
        }
      }
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

    if (setFieldError) {
      setFieldError("personal", field, error);
    }
    return error;
  };

  const handleFieldBlur = (section, field) => {
    if (onBlur) {
      onBlur(section, field);
    }
    validateField(field, formData[field]);
  };

  const handleFieldChange = (section, field, value) => {
    if (onInputChange) {
      onInputChange(section, field, value);
    }
    validateField(field, value);
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-icon">👤</span>
        <div>
          <h2 className="section-title">Personal Details</h2>
          <p className="section-subtitle">
            Enter the athlete&apos;s personal information
          </p>
        </div>
      </div>
      <div className="form-grid">
        <FormField
          section="personal"
          field="fullName"
          label="Full Name"
          type="text"
          value={formData?.fullName || ""}
          error={errors?.fullName || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="personal"
          field="gender"
          label="Gender"
          type="select"
          value={formData?.gender || ""}
          error={errors?.gender || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          options={["Male", "Female", "Other"]}
          required={true}
        />
        <FormField
          section="personal"
          field="dob"
          label="Date of Birth"
          type="date"
          value={formData?.dob || ""}
          error={errors?.dob || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="personal"
          field="mobile"
          label="Mobile Number"
          type="tel"
          value={formData?.mobile || ""}
          error={errors?.mobile || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
        <FormField
          section="personal"
          field="email"
          label="Email Address"
          type="email"
          value={formData?.email || ""}
          error={errors?.email || ""}
          touched={touched || {}}
          submitAttempted={submitAttempted || false}
          onInputChange={handleFieldChange}
          onBlur={handleFieldBlur}
          required={true}
        />
      </div>
    </section>
  );
};

// Static validation method for form-level validation
PersonalDetails.validate = (formData) => {
  const errors = {};

  if (!formData?.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!formData?.gender) {
    errors.gender = "Gender is required";
  }

  if (!formData?.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
    if (age < 5) {
      errors.dob = "Athlete must be at least 5 years old";
    } else if (age > 80) {
      errors.dob = "Invalid date of birth";
    }
  }

  if (!formData?.mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
    errors.mobile = "Mobile number must be 10 digits";
  }

  if (!formData?.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  return errors;
};

export default PersonalDetails;
