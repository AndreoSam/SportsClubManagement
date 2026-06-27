export default function Step5({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      competition: {
        ...formData.competition,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <h3>Competition</h3>

      <input
        name="competitionName"
        placeholder="Competition Name"
        onChange={handleChange}
      />
      <input name="ageGroup" placeholder="Age Group" onChange={handleChange} />
      <input
        name="weightCategory"
        placeholder="Weight Category"
        onChange={handleChange}
      />
      <input name="event" placeholder="Event" onChange={handleChange} />
    </div>
  );
}
