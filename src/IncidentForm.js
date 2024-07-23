import React, { useState } from "react";

function IncidentForm({ onSubmit, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ date, time, description });
    setDate("");
    setTime("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What happened?"
        required
      ></textarea>
      <button type="submit">Add Incident</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default IncidentForm;
