import { NotFoundPage } from './components/ErrorPage';
import { ForecastSection } from './components/ForecastSection';
import { HeroSection } from './components/HeroSection';
import { MethodSection } from './components/MethodSection';
import { SiteFooter } from './components/SiteFooter';
import { useDestinationRanking } from './features/destination-ranking/useDestinationRanking';

function HomePage() {
  const forecast = useDestinationRanking();

  return (
    <>
      <HeroSection
        input={forecast.input}
        onInputChange={forecast.setInput}
        onSubmit={forecast.submit}
        onSuggestionSelect={forecast.chooseCity}
      />
      <main>
        <ForecastSection
          activeDay={forecast.activeDay}
          error={forecast.error}
          fetching={forecast.fetching}
          ranking={forecast.ranking}
          selectedDay={forecast.selectedDay}
          onDaySelect={forecast.setSelectedDay}
          onRetry={forecast.retry}
        />
        <MethodSection />
      </main>
      <SiteFooter />
    </>
  );
}

export function App({
  pathname = window.location.pathname,
}: {
  pathname?: string;
}) {
  return pathname === '/' || pathname === '/index.html' ? (
    <HomePage />
  ) : (
    <NotFoundPage />
  );
}
