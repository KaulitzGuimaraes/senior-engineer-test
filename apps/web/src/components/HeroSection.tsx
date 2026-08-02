import { ArrowRight, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Brand } from './Brand';

const SUGGESTED_DESTINATIONS = ['Lisbon', 'London', 'Chamonix', 'Sydney'];

interface HeroSectionProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSuggestionSelect: (city: string) => void;
}

export function HeroSection({
  input,
  onInputChange,
  onSubmit,
  onSuggestionSelect,
}: HeroSectionProps) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <header className="site-header shell">
        <Brand />
        <nav aria-label="Primary navigation">
          <a href="#forecast">Forecast</a>
          <a href="#method">Our method</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="#forecast">
          Plan a day <ArrowRight size={17} />
        </a>
      </header>

      <div className="hero-content shell">
        <p className="eyebrow light">
          <span /> Thoughtful days, wherever you go
        </p>
        <h1 id="hero-heading">
          Find the right
          <br />
          day for the journey.
        </h1>
        <p className="hero-copy">
          Seven days of weather translated into clear, explainable
          recommendations for the things you want to do.
        </p>

        <form
          className="search-form"
          onSubmit={onSubmit}
          aria-label="Search destination"
        >
          <Search size={22} aria-hidden="true" />
          <label className="sr-only" htmlFor="city">
            City or town
          </label>
          <input
            id="city"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Search a city or town"
            autoComplete="off"
          />
          <button type="submit">
            Explore forecast <ArrowRight size={19} />
          </button>
        </form>

        <div className="quick-searches" aria-label="Suggested destinations">
          <span>Try</span>
          {SUGGESTED_DESTINATIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionSelect(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      <div className="hero-index" aria-hidden="true">
        01 <span />
      </div>
    </section>
  );
}
