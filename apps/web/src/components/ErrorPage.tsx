import { ArrowLeft, Compass, RefreshCw } from 'lucide-react';
import { Brand } from './Brand';

interface ErrorPageProps {
  actionHref?: string;
  actionLabel: string;
  message: string;
  onAction?: () => void;
  status: number;
  title: string;
}

export function ErrorPage({
  actionHref,
  actionLabel,
  message,
  onAction,
  status,
  title,
}: ErrorPageProps) {
  return (
    <main className="error-page">
      <div className="error-orb error-orb-one" />
      <div className="error-orb error-orb-two" />
      <header className="error-header shell">
        <Brand href="/" />
        <span>Weather, made useful</span>
      </header>

      <section
        className="error-page-content shell"
        aria-labelledby="error-title"
      >
        <div className="error-code" aria-hidden="true">
          {status}
        </div>
        <div className="error-message">
          <p className="eyebrow light">
            <span /> The route changed
          </p>
          <Compass aria-hidden="true" />
          <h1 id="error-title">{title}</h1>
          <p>{message}</p>
          {actionHref ? (
            <a className="error-action" href={actionHref}>
              <ArrowLeft size={18} /> {actionLabel}
            </a>
          ) : (
            <button className="error-action" type="button" onClick={onAction}>
              <RefreshCw size={18} /> {actionLabel}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      actionHref="/"
      actionLabel="Return to the forecast"
      message="This destination on our site does not exist. Head back and choose where the next day should take you."
      status={404}
      title="You’ve wandered off the map."
    />
  );
}
