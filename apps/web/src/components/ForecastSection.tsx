import { LocateFixed } from 'lucide-react';
import type { ForecastError } from '../features/destination-ranking/forecast-error';
import type { DestinationRanking, RankedDay } from '../graphql/types';
import { ActivityRanking } from './ActivityRanking';
import { DayPicker } from './DayPicker';
import { ErrorState, LoadingState, ServerErrorState } from './StatusCards';
import { WeatherPanel } from './WeatherPanel';

interface ForecastSectionProps {
  activeDay: RankedDay | undefined;
  error: ForecastError | undefined;
  fetching: boolean;
  ranking: DestinationRanking | undefined;
  selectedDay: number;
  onDaySelect: (index: number) => void;
  onRetry: () => void;
}

export function ForecastSection({
  activeDay,
  error,
  fetching,
  ranking,
  selectedDay,
  onDaySelect,
  onRetry,
}: ForecastSectionProps) {
  return (
    <section className="forecast-section" id="forecast" aria-live="polite">
      <div className="shell">
        {fetching && <LoadingState />}
        {error && !fetching && error.kind !== 'server' && (
          <ErrorState error={error} />
        )}
        {error?.kind === 'server' && !fetching && (
          <ServerErrorState error={error} onRetry={onRetry} />
        )}

        {ranking && activeDay && !fetching && (
          <>
            <div className="results-heading">
              <div>
                <p className="eyebrow">
                  <span /> Your seven-day outlook
                </p>
                <h2>
                  {ranking.location.name}
                  <br />
                  <em>{ranking.location.country}</em>
                </h2>
              </div>
              <div className="location-meta">
                <LocateFixed size={22} />
                <p>
                  {ranking.location.region ?? ranking.location.country}
                  <br />
                  <span>
                    {ranking.location.latitude.toFixed(2)}°,{' '}
                    {ranking.location.longitude.toFixed(2)}°
                  </span>
                </p>
              </div>
            </div>

            <DayPicker
              days={ranking.days}
              selectedDay={selectedDay}
              onSelect={onDaySelect}
            />

            <div className="day-overview">
              <WeatherPanel day={activeDay} />
              <ActivityRanking activities={activeDay.activities} />
            </div>
            <p className="data-note">
              Forecast data from Open-Meteo. Activity scores are directional
              guidance, not safety advice.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
