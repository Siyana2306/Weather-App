import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Get city coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name } = geoData.results[0];

      // Get weather details
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      const currentTime = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      setWeather({
        city: name,
        temperature: weatherData.current.temperature_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        time: currentTime,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>City Weather Finder 🌦️</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getWeather();
            }
          }}
        />

        <button onClick={getWeather}>
          Get Weather
        </button>
      </div>

      {loading && <h3>Fetching weather details...</h3>}

      {error && <h3 className="error">{error}</h3>}

      {weather && (
        <div className="card">
          <h2>{weather.city}</h2>

          <p>🌡️ Temperature: {weather.temperature} °C</p>

          <p>💨 Wind Speed: {weather.windSpeed} km/h</p>

          <p>🕒 Time: {weather.time}</p>
        </div>
      )}
    </div>
  );
}

export default App;