import { CloudRain, RefreshCw } from 'lucide-react';
import type { ForecastError } from '../features/destination-ranking/forecast-error';

export function LoadingState() {
  return (
    <div className="state-card">
      <div className="loader" />
      <div>
        <p className="eyebrow">Reading the week ahead</p>
        <h2>Building your recommendations…</h2>
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: ForecastError }) {
  return (
    <div className="state-card error-state">
      <CloudRain size={42} />
      <div>
        <p className="eyebrow">
          {error.kind === 'not-found'
            ? 'Destination not found'
            : 'Check your search'}
        </p>
        <h2>{error.message}</h2>
        <p>Check the destination and try again.</p>
      </div>
    </div>
  );
}

export function ServerErrorState({
  error,
  onRetry,
}: {
  error: ForecastError;
  onRetry: () => void;
}) {
  return (
    <div className="state-card server-error-state">
      <div className="state-code" aria-hidden="true">
        {error.status}
      </div>
      <div>
        <p className="eyebrow">The forecast service hit some weather</p>
        <h2>We couldn’t complete that request.</h2>
        <p>{error.message} Please try again in a moment.</p>
        <button type="button" onClick={onRetry}>
          Try again <RefreshCw size={17} />
        </button>
      </div>
    </div>
  );
}
