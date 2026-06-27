export default function Step2({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      guardian: {
        ...formData.guardian,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <h3>Guardian Details</h3>

      <input name="guardianName" placeholder="Name" onChange={handleChange} />
      <input name="relation" placeholder="Relation" onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
    </div>
  );
}
