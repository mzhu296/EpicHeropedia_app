import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';

const Superhero = () => {
  const [listDetails, setListDetails] = useState({
    name: '',
    description: '',
    heroes: '',
    visibility: 'private'
  });

  const handleChange = (e) => {
    setListDetails({ ...listDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/superhero-lists', listDetails);
      alert('List created successfully');
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={listDetails.name}
        onChange={handleChange}
        placeholder="List Name"
        required
      />
      <textarea
        name="description"
        value={listDetails.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="heroes"
        value={listDetails.heroes}
        onChange={handleChange}
        placeholder="Heroes (comma-separated)"
        required
      />
      <select name="visibility" value={listDetails.visibility} onChange={handleChange}>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      <button type="submit">Create List</button>
    </form>
  );
};

export default Superhero;

