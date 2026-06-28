import React from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const DocumentUpload = ({
  files = {},
  fileErrors = {},
  fileInputRefs = {},
  onFileChange,
  onFileClick,
  setFileFieldError,
  emailVerified,
}) => {
  const validateFile = (field, file) => {
    let error = "";

    if (!file) {
      error = "File is required";
    } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      error = "Only JPG, PNG, and PDF files are allowed";
    } else if (file.size > MAX_FILE_SIZE) {
      error = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    if (setFileFieldError) {
      setFileFieldError(field, error);
    }
    return error;
  };

  const handleFileChange = (field, file) => {
    if (onFileChange) {
      onFileChange(field, file);
    }
    validateFile(field, file);
  };

  const renderFileUpload = (field, label, icon) => {
    const error = fileErrors[field] || "";
    const hasError = error && (!files[field] || files[field]);

    return (
      <div className="form-group full-width">
        <label className="form-label">
          {icon} {label} <span className="required">*</span>
        </label>

        <div
          className={`file-upload-wrapper ${hasError ? "error" : ""} ${
            !emailVerified ? "disabled-upload" : ""
          }`}
          onClick={() => {
            if (!emailVerified) {
              alert("Please verify your email before uploading documents.");
              return;
            }

            if (onFileClick && fileInputRefs[field]) {
              onFileClick(field);
            }
          }}
        >
          <input
            ref={fileInputRefs[field] || null}
            type="file"
            disabled={!emailVerified}
            onChange={(e) => handleFileChange(field, e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
          />
          <div className="file-upload-label">
            <span className="file-upload-icon">📤</span>
            <span className="file-upload-text">
              {files[field] && !fileErrors[field] ? (
                <span style={{ color: "#22c55e" }}>✅ {files[field].name}</span>
              ) : (
                <>
                  Click to upload <strong>{label}</strong>
                </>
              )}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {hasError && <span className="error-message">{error}</span>}

          {!error && files[field] && files[field].type && (
            <span className="file-type">
              {files[field].type.split("/")[1].toUpperCase()}
            </span>
          )}

          {files[field] &&
            (files[field].size > 2 * 1024 * 1024 ? (
              <span
                className="error-message"
                style={{ color: "#ef4444", fontWeight: "600" }}
              >
                ❌ File size exceeds 2 MB (
                {(files[field].size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            ) : (
              <div className="file-name">
                📎 {(files[field].size / 1024).toFixed(1)} KB
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <span className="section-icon">📄</span>
        <div>
          <h2 className="section-title">Upload Documents</h2>
          <p className="section-subtitle">
            Upload required documents (JPG, PNG, PDF formats, max 5MB)
          </p>
        </div>
      </div>
      <div className="form-grid">
        {renderFileUpload("passportPhoto", "Passport Photo", "📸")}
        {renderFileUpload("birthCertificate", "Birth Certificate", "📜")}
        {renderFileUpload("medicalCertificate", "Medical Certificate", "🏥")}
        {renderFileUpload("consentForm", "Consent Form", "📝")}
      </div>
    </section>
  );
};

DocumentUpload.validate = (files) => {
  const errors = {};
  const fileFields = [
    "passportPhoto",
    "birthCertificate",
    "medicalCertificate",
    "consentForm",
  ];

  fileFields.forEach((field) => {
    const file = files ? files[field] : null;
    if (!file) {
      errors[field] = "File is required";
    } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors[field] = "Only JPG, PNG, and PDF files are allowed";
    } else if (file.size > MAX_FILE_SIZE) {
      errors[field] =
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
  });

  return errors;
};

export default DocumentUpload;
