import React, { useState, useEffect } from 'react';
import './RecentSearches.css';

const RecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(searches);
    
    // Fetch weather data for each recent search
    searches.forEach(city => {
      fetchWeatherForCity(city);
    });
  }, []);

  const fetchWeatherForCity = async (city) => {
    try {
      const API_KEY = '779993f88034a70778e224da7ea213c7';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(prev => ({
        ...prev,
        [city]: data
      }));
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
    }
  };

  const handleSearch = (city) => {
    // Move this city to the top of recent searches
    const updatedSearches = [city, ...recentSearches.filter(s => s !== city)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Refresh weather data
    fetchWeatherForCity(city);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setWeatherData({});
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="recent-searches-container">
      <div className="recent-header">
        <h2>Recent Searches</h2>
        {recentSearches.length > 0 && (
          <button onClick={clearRecentSearches} className="clear-button">
            Clear All
          </button>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <div className="no-searches">
          <p>No recent searches yet. Start searching for cities to see them here!</p>
        </div>
      ) : (
        <div className="searches-grid">
          {recentSearches.map((city, index) => {
            const weather = weatherData[city];
            return (
              <div key={index} className="search-card">
                <div className="search-card-header">
                  <h3>{city}</h3>
                  <button 
                    onClick={() => handleSearch(city)}
                    className="refresh-button"
                    title="Refresh weather data"
                  >
                    🔄
                  </button>
                </div>
                
                {weather ? (
                  <div className="weather-info">
                    <div className="temp-main">
                      <span className="temp">{Math.round(weather.main.temp)}°C</span>
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                        alt={weather.weather[0].description}
                      />
                    </div>
                    <p className="description">{weather.weather[0].description}</p>
                    <div className="weather-details">
                      <span>💧 {weather.main.humidity}%</span>
                      <span>💨 {weather.wind.speed} m/s</span>
                    </div>
                  </div>
                ) : (
                  <div className="loading-weather">
                    <p>Loading weather data...</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
