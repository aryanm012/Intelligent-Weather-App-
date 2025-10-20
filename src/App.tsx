import { useState, useEffect } from 'react'
import { Search, MapPin, CloudSun, AlertCircle, Trash2 } from 'lucide-react'
import WeatherCard from "./components/WeatherCard"


function App() {
  const [city, setCity] = useState("")
  const [weatherList, setWeatherList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("weatherList");
    if (saved) {
      setWeatherList(JSON.parse(saved));
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("weatherList", JSON.stringify(weatherList));
    }
  }, [weatherList, initialized]);

  const fetchWeather = async (options: { city?: string; lat?: number; lon?: number }) => {
    const { city, lat, lon } = options;

    if (!city && (lat == undefined || lon == undefined)) {
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Build the URL to your backend API
      let url = "/api/weather";
      const params = new URLSearchParams();

      if (city) {
        params.append("city", city);
      } else if (lat !== undefined && lon !== undefined) {
        params.append("lat", lat.toString());
        params.append("lon", lon.toString());
      }

      const result = await fetch(`${url}?${params.toString()}`);
      const data = await result.json();

      if (!result.ok) {
        setError(data.error || "Failed to fetch weather data");
      } else {
        setWeatherList(prev => {
          const exists = prev.some(w => w.name === data.name);
          return exists ? prev : [...prev, data];
        });
        setCity("");
      }
    } catch (err) {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  // Get user's location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      return
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeather({ lat: latitude, lon: longitude })
      },
      () => {
        setError("Unable to retrieve your location.")
        setLoading(false);
      }
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && city.trim()) {
      fetchWeather({ city: city })
    }
  }

  const resetWeatherList = () => {
    setWeatherList([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSun size={48} className="text-yellow-300" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Weather App
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            Search for any city or use your current location
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pl-12 rounded-xl text-gray-900 border-2 border-transparent focus:outline-none focus:border-blue-400 transition bg-white shadow-lg"
              />
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
              />
            </div>
            <button
              onClick={() => fetchWeather({ city: city })}
              disabled={loading || !city.trim()}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>

            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg flex items-center justify-center gap-2"
              title="Use current location"
            >
              <MapPin size={20} />
              {/* <span className="hidden sm:inline">Current Location</span> */}
            </button>
            <button
              onClick = {resetWeatherList}
              className="px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg flex items-center justify-center gap-2"
              title = "Clear Weather Results"
            >
              <Trash2 size={20}/>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-300/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-200 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-100">{error}</p>
            </div>
          )}
        </div>

        {/* Weather Cards Grid */}
        {weatherList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weatherList.map((w, index) => (
              <WeatherCard key={index} weather={w} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <CloudSun size={64} className="text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-xl">
                Search for a city to see weather information
              </p>
            </div>
          )
        )}

        {/* Loading State */}
        {loading && weatherList.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mb-4"></div>
            <p className="text-white/80 text-lg">Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App