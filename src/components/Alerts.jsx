import React, { useState, useEffect } from 'react';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    city: '',
    condition: 'temperature',
    threshold: '',
    operator: 'greater',
    type: 'email'
  });

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('weatherAlerts') || '[]');
    setAlerts(savedAlerts);
  }, []);

  const conditions = [
    { value: 'temperature', label: 'Temperature (°C)', unit: '°C' },
    { value: 'humidity', label: 'Humidity (%)', unit: '%' },
    { value: 'windSpeed', label: 'Wind Speed (m/s)', unit: 'm/s' },
    { value: 'pressure', label: 'Pressure (hPa)', unit: 'hPa' }
  ];

  const operators = [
    { value: 'greater', label: 'Greater than' },
    { value: 'less', label: 'Less than' },
    { value: 'equals', label: 'Equals' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAlert = (e) => {
    e.preventDefault();
    
    if (!newAlert.city || !newAlert.threshold) {
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      threshold: parseFloat(newAlert.threshold),
      createdAt: new Date().toISOString(),
      active: true
    };

    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('weatherAlerts', JSON.stringify(updatedAlerts));

    // Reset form
    setNewAlert({
      city: '',
      condition: 'temperature',
      threshold: '',
      operator: 'greater',
      type: 'email'
    });
  };

  const deleteAlert = (id) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('weatherAlerts', JSON.stringify(updatedAlerts));
  };

  const toggleAlert = (id) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('weatherAlerts', JSON.stringify(updatedAlerts));
  };

  const getConditionLabel = (condition) => {
    const cond = conditions.find(c => c.value === condition);
    return cond ? cond.label : condition;
  };

  const getConditionUnit = (condition) => {
    const cond = conditions.find(c => c.value === condition);
    return cond ? cond.unit : '';
  };

  const getOperatorLabel = (operator) => {
    const op = operators.find(o => o.value === operator);
    return op ? op.label : operator;
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Weather Alerts</h2>
        <p>Set up custom weather alerts for your favorite cities</p>
      </div>

      <div className="create-alert-form">
        <h3>Create New Alert</h3>
        <form onSubmit={addAlert} className="alert-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={newAlert.city}
                onChange={handleInputChange}
                placeholder="Enter city name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={newAlert.condition}
                onChange={handleInputChange}
              >
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="operator">Operator</label>
              <select
                id="operator"
                name="operator"
                value={newAlert.operator}
                onChange={handleInputChange}
              >
                {operators.map(operator => (
                  <option key={operator.value} value={operator.value}>
                    {operator.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="threshold">
                Threshold ({getConditionUnit(newAlert.condition)})
              </label>
              <input
                type="number"
                id="threshold"
                name="threshold"
                value={newAlert.threshold}
                onChange={handleInputChange}
                step="0.1"
                placeholder="Enter threshold value"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Notification Type</label>
              <select
                id="type"
                name="type"
                value={newAlert.type}
                onChange={handleInputChange}
              >
                <option value="email">Email</option>
                <option value="push">Push Notification</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>

          <button type="submit" className="create-alert-button">Create Alert</button>
        </form>
      </div>

      <div className="alerts-list">
        <h3>Your Alerts ({alerts.length})</h3>
        
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <p>No alerts set up yet. Create your first weather alert above!</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-card ${!alert.active ? 'inactive' : ''}`}>
                <div className="alert-header">
                  <div className="alert-title">
                    <h4>{alert.city}</h4>
                    <span className={`alert-status ${alert.active ? 'active' : 'inactive'}`}>
                      {alert.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="alert-actions">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className="toggle-button"
                      title={alert.active ? 'Deactivate' : 'Activate'}
                    >
                      {alert.active ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="delete-button"
                      title="Delete alert"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="alert-condition">
                  <p>
                    Alert when <strong>{getConditionLabel(alert.condition)}</strong> is{' '}
                    <strong>{getOperatorLabel(alert.operator)}</strong>{' '}
                    <strong>{alert.threshold}{getConditionUnit(alert.condition)}</strong>
                  </p>
                </div>

                <div className="alert-meta">
                  <span className="alert-type">📧 {alert.type}</span>
                  <span className="alert-date">
                    Created {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
