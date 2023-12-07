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

  const [showAup, setShowAup] = useState(false);
  const [showDmca, setShowDmca] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const toggleAup = () => {
    setShowAup(!showAup);
    setShowDmca(false); // Hide other sections when showing AUP
    setShowPrivacy(false);
  };

  const toggleDmca = () => {
    setShowDmca(!showDmca);
    setShowAup(false); // Hide other sections when showing DMCA
    setShowPrivacy(false);
  };

  const togglePrivacy = () => {
    setShowPrivacy(!showPrivacy);
    setShowAup(false); // Hide other sections when showing Privacy Policy
    setShowDmca(false);
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
        {/* Toggle Button */}
        <button onClick={toggleAup}>
          {showAup ? 'Hide AUP' : 'Show AUP'}
        </button>
        <button onClick={toggleDmca}>
            {showDmca ? 'Hide DMCA' : 'Show DMCA'}
        </button>
        <button onClick={togglePrivacy}>
            {showPrivacy ? 'Hide Privacy' : 'Show Privacy'}
        </button>
        {/* Acceptable Use Policy */}
        {showAup && (
          <div className="aup">
            <h2>Acceptable Use Policy (AUP)</h2>
            <p>The Acceptable Use Policy defines the rules and guidelines for using Superhero Search and Lists and its services. All users are expected to adhere to this policy.</p>
            <p><strong>Prohibited Activities:</strong> Users may not use our services for any illegal purpose, to infringe upon the rights of others, to distribute harmful or offensive content, or to harm the security or integrity of our website or services.</p>
            <p><strong>Enforcement:</strong> Violations of this policy may result in suspension or termination of access to our services and legal action if necessary.</p>
            <p><strong>Reporting Abuse:</strong> If you encounter any violation of this policy, please report it to us immediately.</p>
            <p><strong>Modification of the Policy:</strong> We reserve the right to modify this policy at any time. Continued use of the site after such changes will constitute acceptance of the new terms.</p>
          </div>
        )}
        {showDmca && (
          <div className="dmca">
            <h2>DMCA Notice & Takedown Policy</h2>
            <p>This policy outlines how Superhero Search and Lists handles copyright infringement claims in accordance with the DMCA.</p>
            <p><strong>Filing a DMCA Notice:</strong> To file a copyright infringement claim, please provide a written notice including a clear description of the copyrighted work, the infringing material, and your contact information.</p>
            <p><strong>Takedown Process:</strong> Upon receipt of a valid DMCA notice, we will promptly remove or disable access to the infringing material and notify the content provider.</p>
            <p><strong>Counter-Notice:</strong> If you believe your content was wrongly removed, you may submit a counter-notice containing your contact information, a description of the removed content, and a statement of belief that the removal was a mistake.</p>
            <p><strong>Contact Information:</strong> All DMCA notices and counter-notices should be sent to our designated agent at [Your Contact Information].</p>
          </div>
        )}
        {showPrivacy && (
          <div className="privacy">
            <h2>Security and Privacy Policy</h2>
            <p>This Security and Privacy Policy explains how Superhero Search and Lists collects, uses, secures, and shares your personal information. We are committed to protecting the privacy and security of our users.</p >
            <p><strong>Information Collection:</strong> We collect information that you provide directly to us, such as when you create an account, post content, or contact us. We also automatically collect certain information when you use our site, like your IP address and browsing behavior.</p >
            <p><strong>Use of Information:</strong> The information we collect is used to provide, maintain, and improve our services, to communicate with you, and to ensure a safe and secure environment on our platform.</p >
            <p><strong>Data Security:</strong> We implement a variety of security measures to maintain the safety of your personal information. However, no electronic storage or transmission over the Internet can be guaranteed to be 100% secure.</p >
            <p><strong>Changes to This Policy:</strong> We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p >
            <p><strong>Contact Us:</strong> If you have any questions about this privacy policy, please contact us.</p >
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
