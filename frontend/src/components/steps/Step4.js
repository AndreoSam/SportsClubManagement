export default function Step4({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      club: {
        ...formData.club,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <h3>Club Details</h3>

      <input name="clubName" placeholder="Club Name" onChange={handleChange} />
      <input
        name="coachName"
        placeholder="Coach Name"
        onChange={handleChange}
      />
      <input
        name="coachMobile"
        placeholder="Coach Mobile"
        onChange={handleChange}
      />
      <input
        name="stateAssociation"
        placeholder="State Association"
        onChange={handleChange}
      />
    </div>
  );
}
