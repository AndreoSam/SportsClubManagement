export default function Step3({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <h3>Address</h3>

      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="district" placeholder="District" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="pinCode" placeholder="Pin Code" onChange={handleChange} />
    </div>
  );
}
