import { describe, expect, it } from 'vitest';
import {
  indoorSightseeingScorer,
  outdoorSightseeingScorer,
  rankActivities,
  skiingScorer,
  surfingScorer,
  type DailyWeather,
} from './index';

const weather = (overrides: Partial<DailyWeather> = {}): DailyWeather => ({
  date: '2026-08-03',
  weatherCode: 1,
  temperatureMin: 10,
  temperatureMax: 20,
  precipitation: 0,
  rain: 0,
  snowfall: 0,
  windSpeed: 12,
  windGusts: 20,
  cloudCover: 20,
  sunshineHours: 8,
  waveHeight: null,
  wavePeriod: null,
  ...overrides,
});

describe('activity scoring', () => {
  it('rewards fresh snow and cold temperatures for skiing', () => {
    const strong = skiingScorer.score(
      weather({ snowfall: 12, temperatureMin: -8, temperatureMax: -1 }),
    );
    const weak = skiingScorer.score(weather({ temperatureMax: 12 }));

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.rating).toBe('EXCELLENT');
  });

  it('rewards dry and comfortable outdoor conditions', () => {
    const dry = outdoorSightseeingScorer.score(weather());
    const stormy = outdoorSightseeingScorer.score(
      weather({ precipitation: 18, windGusts: 70, sunshineHours: 0 }),
    );

    expect(dry.score).toBeGreaterThan(stormy.score);
  });

  it('makes indoor plans more attractive in heavy rain', () => {
    const dry = indoorSightseeingScorer.score(weather());
    const wet = indoorSightseeingScorer.score(weather({ precipitation: 20 }));

    expect(wet.score).toBeGreaterThan(dry.score);
  });

  it('uses marine conditions when available for surfing', () => {
    const coastal = surfingScorer.score(
      weather({ waveHeight: 1.8, wavePeriod: 11, windSpeed: 10 }),
    );
    const inland = surfingScorer.score(weather());

    expect(coastal.score).toBeGreaterThan(inland.score);
  });

  it('keeps every score within the public 0 to 100 contract', () => {
    const ranked = rankActivities(
      weather({
        precipitation: 100,
        snowfall: 100,
        temperatureMin: -30,
        temperatureMax: 50,
        waveHeight: 10,
        wavePeriod: 20,
        windSpeed: 150,
        windGusts: 200,
      }),
    );

    expect(ranked.every(({ score }) => score >= 0 && score <= 100)).toBe(true);
  });

  it('returns all activities ordered from highest to lowest score', () => {
    const ranked = rankActivities(weather());

    expect(new Set(ranked.map(({ activity }) => activity)).size).toBe(4);
    expect(ranked).toHaveLength(4);
    expect(ranked.map(({ score }) => score)).toEqual(
      ranked.map(({ score }) => score).sort((left, right) => right - left),
    );
  });
});
