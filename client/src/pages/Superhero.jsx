import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

const Superhero = () => {
  const [listDetails, setListDetails] = useState({
    name: '',
    description: '',
    superheroId: '',
    visibility: 'private',
  });
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [editListDetails, setEditListDetails] = useState({
    name: '',
    description: '',
    superheroId: '',
    visibility: 'private',
  });
  const [review, setReview] = useState({
    rating: 1,
    comment: '',
  });

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

  const [showRatingAndReviews, setShowRatingAndReviews] = useState(false);

  const toggleRatingAndReviews = () => {
    setShowRatingAndReviews(false);
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
      // Fetch reviews for the selected list
      const reviewsResponse = await axios.get(`/api/superhero-lists/${listName}/reviews`);
      setSelectedList({ ...selectedList, reviews: reviewsResponse.data });
    } catch (error) {
      console.error('Error fetching list details:', error);
    }
  };  

  const handleEditList = (listName) => {
    const selectedList = lists.find((list) => list.name === listName);
    if (selectedList) {
      setEditListDetails({
        name: selectedList.name,
        description: selectedList.description,
        superheroId: selectedList.superheroId,
        visibility: selectedList.visibility,
      });
    }
  };

  const handleEditChange = (e) => {
    setEditListDetails({ ...editListDetails, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/superhero-lists/${editListDetails.name}`, editListDetails);
      alert(`List '${editListDetails.name}' updated successfully`);
      await fetchLists();
      setEditListDetails({
        name: '',
        description: '',
        superheroId: '',
        visibility: 'private',
      });
      setSelectedList(null);
    } catch (error) {
      console.error('Error editing list:', error);
      alert('Error editing list');
    }
  };

  const handleDeleteList = async (listName) => {
    try {
      await axios.delete(`/api/superhero-lists/${listName}`);
      alert(`List '${listName}' deleted successfully`);
  
      // Clear the selectedList state
      setSelectedList(null);
  
      await fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Error deleting list');
    }
  };  

  const handleAddReview = async (listName) => {
    try {
      await axios.post(`/api/superhero-lists/${listName}/reviews`, review);
      alert('Review added successfully');
      setReview({
        rating: 1,
        comment: '',
      });
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review');
    }
  };

  const renderLists = () => {
    return lists.map((list, index) => (
      <div key={index} onClick={() => handleSelectList(list.name)} className="list-item">
        {list.name}
        <button onClick={() => handleEditList(list.name)}>Edit</button>
        <button onClick={() => handleDeleteList(list.name)}>Delete</button>
        <button onClick={toggleRatingAndReviews}>
        {showRatingAndReviews ? 'Hide Rating and Reviews' : 'Show Rating and Reviews'}
        </button>
        {list.name === editListDetails.name && (
          <div className="edit-list-form">
            <h3>Edit List</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="input-group">
                <input
                  name="name"
                  value={editListDetails.name}
                  onChange={handleEditChange}
                  placeholder="List Name"
                  required
                />
                <input
                  name="superheroId"
                  value={editListDetails.superheroId}
                  onChange={handleEditChange}
                  placeholder="Hero Id (comma-separated)"
                  required
                />
                <input
                  name="description"
                  value={editListDetails.description}
                  onChange={handleEditChange}
                  placeholder="List Description"
                />
              </div>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    ));
  };

  const renderListDetails = () => {
    if (!selectedList || !selectedList.heroes) return null;
  
    return (
      <div className="list-details">
        <h3>List name: {selectedList.name}</h3>
        <p>List description: {selectedList.description}</p>
        <ul>
          {selectedList.heroes.map((heroDetail, index) => (
            <li key={index}>
              name: {heroDetail.info.name} - publisher: {heroDetail.info.Publisher}
            </li>
          ))}
        </ul>
        {selectedList.visibility === 'public' && (
          <div>
            <h3>Add Review</h3>
            <form>
              <div className="input-group">
                <label>Rating:</label>
                <input
                  type="number"
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: e.target.value })}
                  min="1"
                  max="5"
                />
              </div>
              <div className="input-group">
                <label>Comment (optional):</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                />
              </div>
              <button onClick={() => handleAddReview(selectedList.name)}>Add Review</button>
            </form>
          </div>
        )}
        {selectedList.reviews && selectedList.reviews.length > 0 && (
          <div>
            <h3>Rating and Reviews</h3>
            <ul>
              {selectedList.reviews.map((review, index) => (
                <li key={index}>
                  Rating: {review.rating}
                  <br />
                  Comment: {review.comment}
                  <br />
                  Timestamp: {new Date(review.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
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
          <input
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
