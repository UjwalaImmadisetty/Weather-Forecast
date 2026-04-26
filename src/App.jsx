import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import RecentSearches from './components/RecentSearches';
import Favorites from './components/Favorites';
import Alerts from './components/Alerts';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedCity, setSelectedCity] = useState('London');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleCitySearch = (city) => {
    setSelectedCity(city);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <Navbar user={user} onLogout={handleLogout} onSearch={handleCitySearch} />
        )}
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home city={selectedCity} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recent" 
            element={isAuthenticated ? <RecentSearches /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/favorites" 
            element={isAuthenticated ? <Favorites /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/alerts" 
            element={isAuthenticated ? <Alerts /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
