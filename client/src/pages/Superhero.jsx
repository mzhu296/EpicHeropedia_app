import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

const Superhero = () => {
  const [listDetails, setListDetails] = useState({
    name: '',
    description: '',
    superheroId: '',
    visibility: 'private'
  });
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const handleChange = (e) => {
    setListDetails({ ...listDetails, [e.target.name]: e.target.value });
  };

  const fetchLists = async () => {
    try {
      const response = await axios.get('/api/superhero-lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/superhero-lists', listDetails);
      alert('List created successfully');
      await fetchLists();
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list');
    }
  };

  const handleSelectList = async (listName) => {
    try {
      const response = await axios.get(`/api/superhero-lists/${listName}`);
      setSelectedList(response.data);
    } catch (error) {
      console.error('Error fetching list details:', error);
    }
  };
  
  const renderLists = () => {
    return lists.map((list, index) => (
      <div key={index} onClick={() => handleSelectList(list.name)} className="list-item">
        {list.name}
      </div>
    ));
  };

  const renderListDetails = () => {
    if (!selectedList || !selectedList.heroes) return null;
  
    return (
      <div className="list-details">
        <h3>list name: {selectedList.name}</h3>
        <p>list discription: {selectedList.description}</p>
        <ul>
          {selectedList.heroes.map((heroDetail, index) => (
            <li key={index}>
              name: {heroDetail.info.name} - publisher: {heroDetail.info.Publisher}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  

  return (
    <div className="superhero-container">
  <div className="form-container">
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          name="name"
          value={listDetails.name}
          onChange={handleChange}
          placeholder="List Name"
          required
        />
        <input
          name="superheroId"
          value={listDetails.superheroId}
          onChange={handleChange}
          placeholder="SuperheroId (comma-separated)"
          required
        />
        <select name="visibility" value={listDetails.visibility} onChange={handleChange}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>
      <textarea
        name="description"
        value={listDetails.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button type="submit">Create List</button>
    </form>
  </div>

      <div className="lists-container">
        <h2>Superhero Lists</h2>
        {renderLists()}
      </div>

      <div className="list-details-container">
        <h2>List Details</h2>
        {renderListDetails()}
      </div>
    </div>
  );
};

export default Superhero;
