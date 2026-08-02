export type ActivityId =
  'SKIING' | 'SURFING' | 'OUTDOOR_SIGHTSEEING' | 'INDOOR_SIGHTSEEING';

export type Rating = 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';

export interface Location {
  name: string;
  country: string;
  region: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  temperatureMin: number;
  temperatureMax: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  windSpeed: number;
  windGusts: number;
  cloudCover: number;
  sunshineHours: number;
  waveHeight: number | null;
  wavePeriod: number | null;
}

export interface ActivityScore {
  activity: ActivityId;
  score: number;
  rating: Rating;
  reasons: string[];
}

export interface RankedDay {
  date: string;
  weather: DailyWeather;
  activities: ActivityScore[];
}

export interface DestinationRanking {
  location: Location;
  generatedAt: string;
  days: RankedDay[];
}

export interface ActivityScorer {
  activity: ActivityId;
  score(weather: DailyWeather): ActivityScore;
}

const clamp = (value: number) => Math.round(Math.max(0, Math.min(100, value)));

const ratingFor = (score: number): Rating => {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'FAIR';
  return 'POOR';
};

const result = (
  activity: ActivityId,
  score: number,
  reasons: string[],
): ActivityScore => {
  const normalized = clamp(score);
  return {
    activity,
    score: normalized,
    rating: ratingFor(normalized),
    reasons,
  };
};

const averageTemperature = (weather: DailyWeather) =>
  (weather.temperatureMin + weather.temperatureMax) / 2;

export const skiingScorer: ActivityScorer = {
  activity: 'SKIING',
  score(weather) {
    let score = 30;
    const reasons: string[] = [];

    if (weather.snowfall >= 8) {
      score += 45;
      reasons.push('Strong fresh snowfall forecast');
    } else if (weather.snowfall >= 2) {
      score += 30;
      reasons.push('Useful fresh snowfall expected');
    } else {
      score -= 12;
      reasons.push('Little or no fresh snowfall');
    }

    if (weather.temperatureMax <= 2 && weather.temperatureMin >= -15) {
      score += 22;
      reasons.push('Temperatures support good snow conditions');
    } else if (weather.temperatureMax > 7) {
      score -= 18;
      reasons.push('Mild temperatures may soften snow');
    }

    if (weather.windGusts > 55) {
      score -= 22;
      reasons.push('Strong gusts may affect lift operations');
    } else if (weather.windSpeed < 25) {
      score += 8;
      reasons.push('Manageable wind conditions');
    }

    return result(this.activity, score, reasons.slice(0, 3));
  },
};

export const surfingScorer: ActivityScorer = {
  activity: 'SURFING',
  score(weather) {
    let score = 20;
    const reasons: string[] = [];

    if (weather.waveHeight === null || weather.wavePeriod === null) {
      reasons.push('No reliable marine forecast near this location');
    } else {
      if (weather.waveHeight >= 1 && weather.waveHeight <= 2.5) {
        score += 40;
        reasons.push('Wave height is in a versatile surf range');
      } else if (weather.waveHeight > 0.5 && weather.waveHeight < 4) {
        score += 24;
        reasons.push('Surfable wave height forecast');
      } else if (weather.waveHeight >= 4) {
        score -= 10;
        reasons.push('Large waves may suit experts only');
      } else {
        reasons.push('Small waves reduce surf potential');
      }

      if (weather.wavePeriod >= 9) {
        score += 24;
        reasons.push('Longer-period waves improve quality');
      } else {
        score += 8;
        reasons.push('Short-period waves may be less organised');
      }
    }

    if (weather.windSpeed > 35) {
      score -= 18;
      reasons.push('Strong winds may create messy conditions');
    } else if (weather.windSpeed < 20) {
      score += 10;
      reasons.push('Lighter winds are favourable');
    }

    return result(this.activity, score, reasons.slice(0, 3));
  },
};

export const outdoorSightseeingScorer: ActivityScorer = {
  activity: 'OUTDOOR_SIGHTSEEING',
  score(weather) {
    let score = 42;
    const reasons: string[] = [];
    const temperature = averageTemperature(weather);

    if (temperature >= 12 && temperature <= 25) {
      score += 22;
      reasons.push('Comfortable temperature for exploring');
    } else if (temperature < 4 || temperature > 32) {
      score -= 18;
      reasons.push('Temperature may be uncomfortable outdoors');
    }

    if (weather.precipitation <= 0.5) {
      score += 18;
      reasons.push('Mostly dry conditions');
    } else if (weather.precipitation >= 8) {
      score -= 30;
      reasons.push('Significant precipitation expected');
    } else {
      score -= 10;
      reasons.push('Some showers may interrupt plans');
    }

    if (weather.sunshineHours >= 6) {
      score += 12;
      reasons.push('Plenty of sunshine expected');
    } else if (weather.windGusts > 50) {
      score -= 18;
      reasons.push('Strong gusts reduce comfort');
    }

    return result(this.activity, score, reasons.slice(0, 3));
  },
};

export const indoorSightseeingScorer: ActivityScorer = {
  activity: 'INDOOR_SIGHTSEEING',
  score(weather) {
    let score = 58;
    const reasons: string[] = [
      'Indoor plans are resilient to changing weather',
    ];
    const temperature = averageTemperature(weather);

    if (weather.precipitation >= 8) {
      score += 26;
      reasons.push('Wet weather makes indoor attractions appealing');
    } else if (weather.precipitation >= 2) {
      score += 14;
      reasons.push('Showers favour a flexible indoor plan');
    } else {
      score -= 5;
      reasons.push('Dry weather leaves more outdoor options');
    }

    if (temperature < 4 || temperature > 30) {
      score += 12;
      reasons.push('Indoor comfort avoids temperature extremes');
    }

    return result(this.activity, score, reasons.slice(0, 3));
  },
};

export const activityScorers: ActivityScorer[] = [
  skiingScorer,
  surfingScorer,
  outdoorSightseeingScorer,
  indoorSightseeingScorer,
];

export const rankActivities = (weather: DailyWeather): ActivityScore[] =>
  activityScorers
    .map((scorer) => scorer.score(weather))
    .sort((left, right) => right.score - left.score);
