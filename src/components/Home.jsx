import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = ({ city = 'London' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timezoneOffset, setTimezoneOffset] = useState(0);

  const API_KEY = '779993f88034a70778e224da7ea213c7';

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const getDailyForecast = (list, offsetSeconds) => {
    if (!Array.isArray(list)) return [];

    const byDate = new Map();
    for (const item of list) {
      if (!item || typeof item.dt !== 'number') continue;

      const d = new Date((item.dt + offsetSeconds) * 1000);
      const dateKey = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
      const bucket = byDate.get(dateKey) || [];
      bucket.push(item);
      byDate.set(dateKey, bucket);
    }

    const daily = Array.from(byDate.entries())
      .map(([_, items]) => {
        let best = items[0];
        let bestScore = Infinity;
        for (const item of items) {
          const d = new Date((item.dt + offsetSeconds) * 1000);
          const hour = d.getUTCHours();
          const score = Math.abs(hour - 12);
          if (score < bestScore) {
            best = item;
            bestScore = score;
          }
        }
        return best;
      })
      .sort((a, b) => a.dt - b.dt);

    return daily.slice(0, 5);
  };

  const fetchWeatherData = async (city) => {
    setLoading(true);
    try {
      // Current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weather = await weatherResponse.json();

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      setWeatherData(weather);
      const offsetSeconds =
        (typeof weather?.timezone === 'number' && weather.timezone) ||
        (typeof forecastData?.city?.timezone === 'number' && forecastData.city.timezone) ||
        0;
      setTimezoneOffset(offsetSeconds);
      setForecast(getDailyForecast(forecastData?.list, offsetSeconds));
      
      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updatedSearches = [city, ...recentSearches.filter(s => s !== city)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date((timestamp + timezoneOffset) * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatTime = (timestamp) => {
    return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  if (loading) {
    return <div className="loading">Loading weather data...</div>;
  }

  if (!weatherData) {
    return <div className="error">Failed to load weather data</div>;
  }

  return (
    <div className="home-container">
      <div className="weather-card">
        <div className="weather-header">
          <h1>{weatherData.name}, {weatherData.sys.country}</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="current-weather">
          <div className="temperature">
            <span className="temp-main">{Math.round(weatherData.main.temp)}°C</span>
            <span className="temp-feels">Feels like {Math.round(weatherData.main.feels_like)}°C</span>
          </div>
          <div className="weather-description">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <p>{weatherData.weather[0].description}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span>Humidity</span>
            <span>{weatherData.main.humidity}%</span>
          </div>
          <div className="detail-item">
            <span>Pressure</span>
            <span>{weatherData.main.pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span>Wind Speed</span>
            <span>{weatherData.wind.speed} m/s</span>
          </div>
          <div className="detail-item">
            <span>Visibility</span>
            <span>{(weatherData.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>

        <div className="sun-times">
          <div className="sun-item">
            <span>🌅 Sunrise</span>
            <span>{formatTime(weatherData.sys.sunrise)}</span>
          </div>
          <div className="sun-item">
            <span>🌇 Sunset</span>
            <span>{formatTime(weatherData.sys.sunset)}</span>
          </div>
        </div>
      </div>

      <div className="forecast-section">
        <h2>5-Day Forecast</h2>
        <div className="forecast-grid">
          {forecast.map((item, index) => (
            <div key={index} className="forecast-item">
              <p className="forecast-date">{formatDate(item.dt)}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
              />
              <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
              <p className="forecast-desc">{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
