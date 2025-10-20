import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Gauge,
  MapPin,
  CloudRain,
  CloudSnow,
} from "lucide-react";
import GoogleCalendar from "../components/GoogleCalendar";
import AIInsights from "../components/AIInsight";

export default function WeatherDetail() {
  const location = useLocation();
  const { state } = location as { state?: { weather: any } };
  const navigate = useNavigate();
  const { name } = useParams();

  const [weather, setWeather] = useState(state?.weather || null);
  const [events, setEvents] = useState<any[]>([]);

  // Persist weather after redirect
  useEffect(() => {
    if (!weather) {
      const stored = localStorage.getItem("weather");
      if (stored) setWeather(JSON.parse(stored));
    } else {
      localStorage.setItem("weather", JSON.stringify(weather));
    }
  }, [weather]);

  if (!weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6 text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">
            No weather data found for {name}
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold shadow-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const { main, weather: info, wind, sys, clouds, visibility, coord } = weather;
  const { temp, feels_like, temp_min, temp_max, pressure, humidity } = main;
  const { description, icon } = info[0];
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition border border-white/30"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={18} />
            <span className="text-sm">
              {coord.lat.toFixed(2)}°, {coord.lon.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {weather.name}, {sys.country}
          </h1>
          <p className="text-white/70 mb-8">
            UTC {weather.timezone / 3600 >= 0 ? "+" : ""}
            {weather.timezone / 3600}
          </p>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={description}
              className="w-40 h-40 drop-shadow-2xl"
            />
            <div className="flex-1 text-center md:text-left">
              <p className="text-7xl md:text-8xl font-bold mb-2">
                {Math.round(temp)}°F
              </p>
              <p className="capitalize text-2xl md:text-3xl font-medium mb-2">
                {description}
              </p>
              <p className="text-xl text-white/80">
                Feels like {Math.round(feels_like)}°F
              </p>
              <div className="flex gap-6 mt-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-white/70 text-sm">High</p>
                  <p className="text-2xl font-bold">{Math.round(temp_max)}°</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm">Low</p>
                  <p className="text-2xl font-bold">{Math.round(temp_min)}°</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Humidity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="text-blue-200" size={24} />
              <p className="text-white/70 font-medium">Humidity</p>
            </div>
            <p className="text-3xl font-bold">{humidity}%</p>
          </div>
          {/* Wind */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Wind className="text-blue-200" size={24} />
              <p className="text-white/70 font-medium">Wind</p>
            </div>
            <p className="text-3xl font-bold">{wind.speed}</p>
            <p className="text-sm text-white/70">m/s at {wind.deg}°</p>
          </div>
          {/* Pressure */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Gauge className="text-blue-200" size={24} />
              <p className="text-white/70 font-medium">Pressure</p>
            </div>
            <p className="text-3xl font-bold">{pressure}</p>
            <p className="text-sm text-white/70">hPa</p>
          </div>
          {/* Visibility */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="text-blue-200" size={24} />
              <p className="text-white/70 font-medium">Visibility</p>
            </div>
            <p className="text-3xl font-bold">{(visibility / 1000).toFixed(1)}</p>
            <p className="text-sm text-white/70">km</p>
          </div>
          {/* Cloudiness */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Cloud className="text-blue-200" size={24} />
              <p className="text-white/70 font-medium">Cloudiness</p>
            </div>
            <p className="text-3xl font-bold">{clouds.all}%</p>
          </div>
          {/* Sunrise */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Sunrise className="text-orange-300" size={24} />
              <p className="text-white/70 font-medium">Sunrise</p>
            </div>
            <p className="text-2xl font-bold">{sunrise}</p>
          </div>
          {/* Sunset */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Sunset className="text-orange-400" size={24} />
              <p className="text-2xl font-bold">{sunset}</p>
            </div>
          </div>
        </div>

        {/* Rain/Snow Info */}
        {(weather.rain || weather.snow) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {weather.rain && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <CloudRain className="text-blue-300" size={24} />
                  <p className="text-white/70 font-medium">Rain (last 1h)</p>
                </div>
                <p className="text-3xl font-bold">{weather.rain["1h"] ?? "-"} mm</p>
              </div>
            )}
            {weather.snow && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <CloudSnow className="text-blue-100" size={24} />
                  <p className="text-white/70 font-medium">Snow (last 1h)</p>
                </div>
                <p className="text-3xl font-bold">{weather.snow["1h"] ?? "-"} mm</p>
              </div>
            )}
          </div>
        )}

        {/* Google Calendar + AI Insights */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Your Schedule & AI Insights
          </h2>
          <GoogleCalendar onEventsFetched={setEvents} />
          {/* Render AIInsights once weather exists and events have loaded */}
          {weather && events.length >= 0 && (
            <AIInsights weather={weather} events={events} />
          )}
        </div>
      </div>
    </div>
  );
}
