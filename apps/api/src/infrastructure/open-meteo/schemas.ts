import { z } from 'zod';

export const geocodingSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.string(),
        country: z.string(),
        admin1: z.string().optional(),
        latitude: z.number(),
        longitude: z.number(),
        timezone: z.string(),
      }),
    )
    .optional(),
});

export const weatherSchema = z.object({
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
    rain_sum: z.array(z.number()),
    snowfall_sum: z.array(z.number()),
    wind_speed_10m_max: z.array(z.number()),
    wind_gusts_10m_max: z.array(z.number()),
    cloud_cover_mean: z.array(z.number()),
    sunshine_duration: z.array(z.number()),
  }),
});

export type WeatherResponse = z.infer<typeof weatherSchema>;

export const marineSchema = z.object({
  daily: z
    .object({
      time: z.array(z.string()),
      wave_height_max: z.array(z.number().nullable()),
      wave_period_max: z.array(z.number().nullable()),
    })
    .optional(),
});
