import { useNavigate } from 'react-router-dom';
import { Droplets, Thermometer, ChevronRight } from 'lucide-react';

type WeatherCardProps = {
  weather: any
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { name, main, weather: info, sys } = weather
  const { temp, humidity, feels_like } = main
  const { description, icon } = info[0]
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`weather/${name}`, { state: { weather } });
  };

  return (
    <div
      className="group cursor-pointer bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50 overflow-hidden relative"
      onClick={handleClick}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            {sys?.country && (
              <p className="text-sm text-gray-500">{sys.country}</p>
            )}
          </div>
          <ChevronRight 
            className="text-blue-500 group-hover:translate-x-1 transition-transform" 
            size={24} 
          />
        </div>

        {/* Weather icon and temp */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-24 h-24 drop-shadow-lg"
            />
            <div>
              <p className="text-5xl font-bold text-blue-600">
                {Math.round(temp)}°
              </p>
              <p className="text-sm text-gray-500">Fahrenheit</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="capitalize text-lg font-medium text-gray-700 mb-4">
          {description}
        </p>

        {/* Details */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Thermometer size={16} className="text-orange-500" />
              <span>Feels like</span>
            </div>
            <span className="font-semibold text-gray-800">
              {Math.round(feels_like)}°F
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Droplets size={16} className="text-blue-500" />
              <span>Humidity</span>
            </div>
            <span className="font-semibold text-gray-800">{humidity}%</span>
          </div>
        </div>

        {/* Click indicator */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-center text-gray-400 group-hover:text-blue-500 transition-colors">
            Click for more details
          </p>
        </div>
      </div>
    </div>
  )
}