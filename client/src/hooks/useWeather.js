// client/src/hooks/useWeather.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function useWeather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(${API_BASE}/api/weather);
      if (res.data && res.data.data) {
        setWeatherData(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.warn('Weather API fetch fallback active:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  return { weatherData, loading, error, refetch: fetchWeather };
}
