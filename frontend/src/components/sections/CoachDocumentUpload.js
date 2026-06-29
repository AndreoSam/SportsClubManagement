"use client";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
const MAX_PDF_SIZE = 2 * 1024 * 1024;

const CoachDocumentUpload = ({
  files = {},
  fileErrors = {},
  fileInputRefs = {},
  onFileChange,
  onFileClick,
  emailVerified,
}) => {
  const validateFile = (field, file) => {
    let error = "";
    const MAX_SIZE = field === "resume" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    const ALLOWED_TYPES =
      field === "resume" ? ["application/pdf"] : ["image/jpeg", "image/jpg", "image/png"];

    if (!file) {
      error = "File is required";
    } else if (!ALLOWED_TYPES.includes(file.type)) {
      error = field === "resume" ? "Only PDF files allowed" : "Only JPG, PNG files allowed";
    } else if (file.size > MAX_SIZE) {
      error = `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
    }

    return error;
  };

  const handleFileChange = (field, file) => {
    if (onFileChange) {
      onFileChange(field, file);
    }
  };

  const renderFileUpload = (field, label, icon, accept) => {
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
            accept={accept}
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
            (files[field].size > (field === "resume" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE) ? (
              <span
                className="error-message"
                style={{ color: "#ef4444", fontWeight: "600" }}
              >
                ❌ File size exceeds {field === "resume" ? "2" : "1"} MB (
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
            Upload required documents (Images max 1MB, PDF max 2MB)
          </p>
        </div>
      </div>
      <div className="form-grid">
        {renderFileUpload("passportPhoto", "Passport Photo", "📸", ".pdf,.jpg,.jpeg,.png")}
        {renderFileUpload("governmentId", "Government ID", "🆔", ".pdf,.jpg,.jpeg,.png")}
        {renderFileUpload("coachingCertificate", "Coaching Certificate", "🎖️", ".pdf,.jpg,.jpeg,.png")}
        {renderFileUpload("resume", "Resume", "📋", ".pdf")}
      </div>
    </section>
  );
};

CoachDocumentUpload.validate = (files) => {
  const errors = {};
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
  const MAX_PDF_SIZE = 2 * 1024 * 1024;

  const fileFields = [
    { key: "passportPhoto", maxSize: MAX_IMAGE_SIZE, types: ["image/jpeg", "image/jpg", "image/png"] },
    { key: "governmentId", maxSize: MAX_IMAGE_SIZE, types: ["image/jpeg", "image/jpg", "image/png"] },
    { key: "coachingCertificate", maxSize: MAX_IMAGE_SIZE, types: ["image/jpeg", "image/jpg", "image/png"] },
    { key: "resume", maxSize: MAX_PDF_SIZE, types: ["application/pdf"] },
  ];

  fileFields.forEach(({ key, maxSize, types }) => {
    const file = files ? files[key] : null;

    if (!file) {
      errors[key] = "File is required";
    } else if (!types.includes(file.type)) {
      errors[key] =
        key === "resume"
          ? "Only PDF files allowed"
          : "Only JPG, PNG files allowed";
    } else if (file.size > maxSize) {
      errors[key] = `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }
  });

  return errors;
};

export default CoachDocumentUpload;
