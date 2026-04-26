import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Weather API key
const WEATHER_API_KEY = '779993f88034a70778e224da7ea213c7';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// In-memory storage for demo purposes (in production, use a database)
const users = [];
const userFavorites = new Map();
const userAlerts = new Map();
const recentSearches = new Map();

// Helper function to get user by email
const getUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple demo authentication (accept any email/password)
  if (email && password) {
    let user = getUserByEmail(email);
    
    if (!user) {
      // Create new user if doesn't exist
      user = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }
    
    res.json({
      success: true,
      user,
      token: 'mock-jwt-token-' + Date.now()
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
});

// Weather routes
app.get('/api/weather/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

app.get('/api/weather/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

app.get('/api/weather/air-quality/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Air quality data not found' });
  }
});

// User favorites routes
app.get('/api/user/favorites/:userId', (req, res) => {
  const { userId } = req.params;
  const favorites = userFavorites.get(userId) || [];
  res.json(favorites);
});

app.post('/api/user/favorites/:userId', (req, res) => {
  const { userId } = req.params;
  const { city } = req.body;
  
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  
  const favorites = userFavorites.get(userId) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    userFavorites.set(userId, favorites);
  }
  
  res.json(favorites);
});

app.delete('/api/user/favorites/:userId/:city', (req, res) => {
  const { userId, city } = req.params;
  const favorites = userFavorites.get(userId) || [];
  const updatedFavorites = favorites.filter(fav => fav !== city);
  userFavorites.set(userId, updatedFavorites);
  res.json(updatedFavorites);
});

// User alerts routes
app.get('/api/user/alerts/:userId', (req, res) => {
  const { userId } = req.params;
  const alerts = userAlerts.get(userId) || [];
  res.json(alerts);
});

app.post('/api/user/alerts/:userId', (req, res) => {
  const { userId } = req.params;
  const alert = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    active: true
  };
  
  const alerts = userAlerts.get(userId) || [];
  alerts.push(alert);
  userAlerts.set(userId, alerts);
  
  res.json(alerts);
});

app.put('/api/user/alerts/:userId/:alertId', (req, res) => {
  const { userId, alertId } = req.params;
  const alerts = userAlerts.get(userId) || [];
  const alertIndex = alerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex !== -1) {
    alerts[alertIndex] = { ...alerts[alertIndex], ...req.body };
    userAlerts.set(userId, alerts);
    res.json(alerts[alertIndex]);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

app.delete('/api/user/alerts/:userId/:alertId', (req, res) => {
  const { userId, alertId } = req.params;
  const alerts = userAlerts.get(userId) || [];
  const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
  userAlerts.set(userId, updatedAlerts);
  res.json(updatedAlerts);
});

// Recent searches routes
app.get('/api/user/recent-searches/:userId', (req, res) => {
  const { userId } = req.params;
  const searches = recentSearches.get(userId) || [];
  res.json(searches);
});

app.post('/api/user/recent-searches/:userId', (req, res) => {
  const { userId } = req.params;
  const { city } = req.body;
  
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  
  const searches = recentSearches.get(userId) || [];
  const updatedSearches = [city, ...searches.filter(s => s !== city)].slice(0, 5);
  recentSearches.set(userId, updatedSearches);
  
  res.json(updatedSearches);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Weather app backend server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
