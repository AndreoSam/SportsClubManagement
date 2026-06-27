export default function Step1({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      personal: {
        ...formData.personal,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <h3>Personal Details</h3>

      <input name="fullName" placeholder="Full Name" onChange={handleChange} />

      <input name="gender" placeholder="Gender" onChange={handleChange} />

      <input name="dob" type="date" onChange={handleChange} />

      <input name="mobile" placeholder="Mobile" onChange={handleChange} />

      <input name="email" placeholder="Email" onChange={handleChange} />
    </div>
  );
}
