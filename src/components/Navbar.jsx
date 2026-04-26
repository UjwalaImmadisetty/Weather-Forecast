import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = query.trim();
    if (!city) return;
    if (typeof onSearch === 'function') {
      onSearch(city);
    }
    setQuery('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home">Weather App</Link>
        </div>
        
        <form className="navbar-search" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="navbar-menu">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/recent" className="nav-link">Recent</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/alerts" className="nav-link">Alerts</Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">Welcome, {user?.name}</span>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
