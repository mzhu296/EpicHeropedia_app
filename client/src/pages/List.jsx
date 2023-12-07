// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const List = () => {
//   const [publicLists, setPublicLists] = useState([]);

//   useEffect(() => {
//     // Fetch public hero lists
//     const fetchPublicLists = async () => {
//       try {
//         const response = await axios.get('/api/public-hero-lists');
//         setPublicLists(response.data);
//       } catch (error) {
//         console.error('Error fetching public hero lists:', error);
//       }
//     };

//     fetchPublicLists();
//   }, []);

//   const renderPublicLists = () => {
//     return publicLists.map((list, index) => (
//       <div key={index} className="public-list-item">
//         <h3>List Name: {list.name}</h3>
//         <p>Creator: {list.creator}</p>
//         <p>Number of Heroes: {list.numberOfHeroes}</p>
//         <p>Average Rating: {list.averageRating}</p>
//       </div>
//     ));
//   };

//   return (
//     <div className="public-lists-container">
//       <h2>Public Hero Lists</h2>
//       {renderPublicLists()}
//     </div>
//   );
// };

// export default List;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const List = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);

  useEffect(() => {
    // Fetch public hero lists
    const fetchPublicLists = async () => {
      try {
        const response = await axios.get('/api/public-hero-lists');
        setPublicLists(response.data);
      } catch (error) {
        console.error('Error fetching public hero lists:', error);
      }
    };

    fetchPublicLists();
  }, []);

  const expandList = async (listName) => {
    try {
      // If the list is already expanded, unexpand it
      if (expandedList && expandedList.name === listName) {
        setExpandedList(null);
      } else {
        // If not expanded, fetch and expand the list
        const response = await axios.get(`/api/superhero-lists/${listName}`);
        setExpandedList(response.data);
      }
    } catch (error) {
      console.error('Error fetching or unexpanding list details:', error);
    }
  };
  

  const renderPublicLists = () => {
    return publicLists.map((list, index) => (
      <div key={index} className="public-list-item">
        <h3 onClick={() => expandList(list.name)}>{list.name}</h3>
        <p>Creator: {list.creator}</p>
        <p>Last Modified: {list.createdAt}</p>
        {expandedList && expandedList.name === list.name && (
          <div>
            <p>Description: {expandedList.description}</p>
            <ul>
              {expandedList.heroes.map((hero, index) => (
                <li key={index}>
                  Name: {hero.info.name}  - Publisher: {hero.info.Publisher} - Race : {hero.info.Race} 
                  <br></br>Power: {hero.powers.map((power, index) => (
              <li key={index}>{power}</li>))} <br></br>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p>Average Rating: {list.averageRating}</p>
      </div>
    ));
  };

  return (
    <div className="public-lists-container">
      <h2>Public Hero Lists</h2>
      {renderPublicLists()}
    </div>
  );
};

export default List;
