import React, { useState, useEffect } from 'react';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
    
    // Fetch weather data for each favorite city
    savedFavorites.forEach(city => {
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

  const addToFavorites = (e) => {
    e.preventDefault();
    if (newCity.trim() && !favorites.includes(newCity.trim())) {
      const updatedFavorites = [...favorites, newCity.trim()];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      fetchWeatherForCity(newCity.trim());
      setNewCity('');
    }
  };

  const removeFromFavorites = (city) => {
    const updatedFavorites = favorites.filter(fav => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // Remove weather data for this city
    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[city];
    setWeatherData(updatedWeatherData);
  };

  const refreshWeather = (city) => {
    fetchWeatherForCity(city);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Favorite Cities</h2>
      </div>

      <div className="add-favorite-form">
        <form onSubmit={addToFavorites}>
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add city to favorites..."
            className="city-input"
          />
          <button type="submit" className="add-button">Add to Favorites</button>
        </form>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>No favorite cities yet. Add cities to quickly access their weather!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((city, index) => {
            const weather = weatherData[city];
            return (
              <div key={index} className="favorite-card">
                <div className="favorite-header">
                  <h3>{city}</h3>
                  <div className="favorite-actions">
                    <button 
                      onClick={() => refreshWeather(city)}
                      className="refresh-button"
                      title="Refresh weather data"
                    >
                      🔄
                    </button>
                    <button 
                      onClick={() => removeFromFavorites(city)}
                      className="remove-button"
                      title="Remove from favorites"
                    >
                      ❌
                    </button>
                  </div>
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
                      <div className="detail-item">
                        <span>💧 Humidity</span>
                        <span>{weather.main.humidity}%</span>
                      </div>
                      <div className="detail-item">
                        <span>💨 Wind</span>
                        <span>{weather.wind.speed} m/s</span>
                      </div>
                      <div className="detail-item">
                        <span>🌡️ Feels like</span>
                        <span>{Math.round(weather.main.feels_like)}°C</span>
                      </div>
                      <div className="detail-item">
                        <span>👁️ Visibility</span>
                        <span>{(weather.visibility / 1000).toFixed(1)} km</span>
                      </div>
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

export default Favorites;
