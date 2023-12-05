import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    race: '',
    power: '',
    publisher: ''
  });
  const [results, setResults] = useState([]);
  const [resultLimit, setResultLimit] = useState(10); // Default limit for results

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleResultLimitChange = (e) => {
    setResultLimit(e.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setResults([]);

    try {
      const response = await axios.post('/api/superheroinfo', searchParams);
      setResults(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const searchOnDuckDuckGo = (heroName) => {
    const query = encodeURIComponent(heroName);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
  };

  return (
    <div className="home">
      <div className="home-content">
        <h1>Who is Superhero??</h1>
        <p>"Superhero" refers to a fictional character, typically depicted in comic books, movies, and television shows, possessing extraordinary, often superhuman abilities.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <input name="name" placeholder="Name" value={searchParams.name} onChange={handleInputChange} />
          <input name="race" placeholder="Race" value={searchParams.race} onChange={handleInputChange} />
          <input name="power" placeholder="Power" value={searchParams.power} onChange={handleInputChange} />
          <input name="publisher" placeholder="Publisher" value={searchParams.publisher} onChange={handleInputChange} />
          <input id="result-limit" placeholder="result-limit" value={resultLimit} onChange={handleResultLimitChange}></input>
          <button type="submit">Search</button>
        </form>

        {/* Displaying Results */}
        {results.slice(0, resultLimit).length > 0 ? (
          <div>
            {results.slice(0, resultLimit).map((hero, index) => (
              <div key={index} className="hero-result">
                <h3>{hero.name}</h3>
                <p>Publisher: {hero.Publisher}</p>
                <button onClick={() => searchOnDuckDuckGo(hero.name)}>Search on DDG</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hero found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
