import { Droplets, Sun, Thermometer, Wind } from 'lucide-react';
import type { RankedDay } from '../graphql/types';
import {
  formatDay,
  weatherDescription,
  weatherIcon,
} from '../lib/presentation';

export function WeatherPanel({ day }: { day: RankedDay }) {
  const WeatherIcon = weatherIcon(day.weather.weatherCode);

  return (
    <article className="weather-panel">
      <div className="panel-topline">
        <span>Weather</span>
        <span>{formatDay(day.date, 'long')}</span>
      </div>
      <div className="weather-hero">
        <WeatherIcon />
        <div>
          <p>{weatherDescription(day.weather.weatherCode)}</p>
          <strong>{Math.round(day.weather.temperatureMax)}°</strong>
          <span>Low {Math.round(day.weather.temperatureMin)}°</span>
        </div>
      </div>
      <div className="weather-stats">
        <div>
          <Droplets />
          <span>Precipitation</span>
          <strong>{day.weather.precipitation.toFixed(1)} mm</strong>
        </div>
        <div>
          <Wind />
          <span>Wind</span>
          <strong>{Math.round(day.weather.windSpeed)} km/h</strong>
        </div>
        <div>
          <Sun />
          <span>Sunshine</span>
          <strong>{day.weather.sunshineHours.toFixed(1)} hrs</strong>
        </div>
        <div>
          <Thermometer />
          <span>Range</span>
          <strong>
            {Math.round(day.weather.temperatureMin)}–
            {Math.round(day.weather.temperatureMax)}°
          </strong>
        </div>
      </div>
    </article>
  );
}
