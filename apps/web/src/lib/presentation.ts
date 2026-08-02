import {
  Binoculars,
  Building2,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  MountainSnow,
  Sun,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityId } from '../graphql/types';

export const activityDetails: Record<
  ActivityId,
  { label: string; eyebrow: string; icon: LucideIcon }
> = {
  SKIING: { label: 'Skiing', eyebrow: 'Mountain', icon: MountainSnow },
  SURFING: { label: 'Surfing', eyebrow: 'Coast', icon: Waves },
  OUTDOOR_SIGHTSEEING: {
    label: 'Outdoor sightseeing',
    eyebrow: 'Explore',
    icon: Binoculars,
  },
  INDOOR_SIGHTSEEING: {
    label: 'Indoor sightseeing',
    eyebrow: 'Culture',
    icon: Building2,
  },
};

export const weatherIcon = (code: number): LucideIcon => {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code <= 48) return CloudFog;
  if (code <= 67 || (code >= 80 && code <= 82)) return CloudRain;
  if (code <= 77 || (code >= 85 && code <= 86)) return CloudSnow;
  if (code >= 95) return CloudLightning;
  return Cloud;
};

export const formatDay = (date: string, weekday: 'short' | 'long' = 'short') =>
  new Intl.DateTimeFormat('en-GB', {
    weekday,
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

export const weatherDescription = (code: number) => {
  if (code === 0) return 'Clear skies';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Low visibility';
  if (code <= 67) return 'Rain expected';
  if (code <= 77) return 'Snow expected';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorms';
  return 'Mixed conditions';
};
