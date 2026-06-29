"use client";

export default function CoachDocumentUpload({
  files,
  fileErrors,
  fileInputRefs,
  onFileChange,
  onFileClick,
  emailVerified,
}) {
  const documents = [
    {
      key: "passportPhoto",
      label: "Passport Photo",
      accept: "image/*",
      hint: "JPG, PNG (Max 1 MB)",
    },
    {
      key: "governmentId",
      label: "Government ID",
      accept: "image/*",
      hint: "JPG, PNG (Max 1 MB)",
    },
    {
      key: "coachingCertificate",
      label: "Coaching Certificate",
      accept: "image/*",
      hint: "JPG, PNG (Max 1 MB)",
    },
    {
      key: "resume",
      label: "Resume",
      accept: ".pdf",
      hint: "PDF (Max 2 MB)",
    },
  ];

  return (
    <div className="form-section">
      <h2 className="section-title">Upload Documents</h2>

      {!emailVerified && (
        <div className="warning-message">
          Please verify your email before uploading documents
        </div>
      )}

      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc.key} className="document-upload-box">
            <input
              ref={fileInputRefs[doc.key]}
              type="file"
              accept={doc.accept}
              onChange={(e) => onFileChange(doc.key, e.target.files?.[0] || null)}
              style={{ display: "none" }}
              disabled={!emailVerified}
            />

            <div
              className={`upload-area ${files[doc.key] ? "uploaded" : ""}`}
              onClick={() => emailVerified && onFileClick(doc.key)}
              style={{
                cursor: emailVerified ? "pointer" : "not-allowed",
                opacity: emailVerified ? 1 : 0.6,
              }}
            >
              <div className="upload-icon">
                {files[doc.key] ? "✓" : "📎"}
              </div>
              <h4 className="upload-label">{doc.label} *</h4>
              <p className="upload-hint">
                {files[doc.key]
                  ? files[doc.key].name
                  : `Click to upload\n${doc.hint}`}
              </p>
            </div>

            {fileErrors[doc.key] && (
              <div className="error-text">{fileErrors[doc.key]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

CoachDocumentUpload.validate = (files) => {
  const errors = {};
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
  const MAX_PDF_SIZE = 2 * 1024 * 1024;

  if (!files.passportPhoto) {
    errors.passportPhoto = "Passport photo is required";
  } else {
    if (files.passportPhoto.size > MAX_IMAGE_SIZE) {
      errors.passportPhoto = "File size exceeds 1 MB limit";
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(files.passportPhoto.type)) {
      errors.passportPhoto = "Only JPG/PNG files allowed";
    }
  }

  if (!files.governmentId) {
    errors.governmentId = "Government ID is required";
  } else {
    if (files.governmentId.size > MAX_IMAGE_SIZE) {
      errors.governmentId = "File size exceeds 1 MB limit";
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(files.governmentId.type)) {
      errors.governmentId = "Only JPG/PNG files allowed";
    }
  }

  if (!files.coachingCertificate) {
    errors.coachingCertificate = "Coaching certificate is required";
  } else {
    if (files.coachingCertificate.size > MAX_IMAGE_SIZE) {
      errors.coachingCertificate = "File size exceeds 1 MB limit";
    }
    if (
      !["image/jpeg", "image/jpg", "image/png"].includes(
        files.coachingCertificate.type
      )
    ) {
      errors.coachingCertificate = "Only JPG/PNG files allowed";
    }
  }

  if (!files.resume) {
    errors.resume = "Resume is required";
  } else {
    if (files.resume.size > MAX_PDF_SIZE) {
      errors.resume = "File size exceeds 2 MB limit";
    }
    if (files.resume.type !== "application/pdf") {
      errors.resume = "Only PDF files allowed";
    }
  }

  return errors;
};
