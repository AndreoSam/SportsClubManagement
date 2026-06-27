export default function Step6({ files, setFiles }) {
  const handleFile = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  return (
    <div>
      <h3>Upload Documents</h3>

      <input type="file" name="passportPhoto" onChange={handleFile} />

      <input type="file" name="birthCertificate" onChange={handleFile} />

      <input type="file" name="medicalCertificate" onChange={handleFile} />

      <input type="file" name="consentForm" onChange={handleFile} />
    </div>
  );
}
