import type { RankedDay } from '../graphql/types';
import { activityDetails, formatDay, weatherIcon } from '../lib/presentation';

interface DayPickerProps {
  days: RankedDay[];
  selectedDay: number;
  onSelect: (index: number) => void;
}

export function DayPicker({ days, selectedDay, onSelect }: DayPickerProps) {
  return (
    <div className="day-picker" role="tablist" aria-label="Forecast day">
      {days.map((day, index) => {
        const DayIcon = weatherIcon(day.weather.weatherCode);
        const recommended = activityDetails[day.activities[0]!.activity].label;

        return (
          <button
            key={day.date}
            type="button"
            role="tab"
            aria-selected={selectedDay === index}
            className={selectedDay === index ? 'active' : ''}
            onClick={() => onSelect(index)}
          >
            <span>
              {index === 0 ? 'Today' : formatDay(day.date).split(',')[0]}
            </span>
            <DayIcon size={27} />
            <strong>{Math.round(day.weather.temperatureMax)}°</strong>
            <small>Best: {recommended}</small>
          </button>
        );
      })}
    </div>
  );
}
