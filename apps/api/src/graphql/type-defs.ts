export const typeDefs = /* GraphQL */ `
  enum Activity {
    SKIING
    SURFING
    OUTDOOR_SIGHTSEEING
    INDOOR_SIGHTSEEING
  }

  enum Rating {
    POOR
    FAIR
    GOOD
    EXCELLENT
  }

  type Location {
    name: String!
    country: String!
    region: String
    latitude: Float!
    longitude: Float!
    timezone: String!
  }

  type DailyWeather {
    date: String!
    weatherCode: Int!
    temperatureMin: Float!
    temperatureMax: Float!
    precipitation: Float!
    rain: Float!
    snowfall: Float!
    windSpeed: Float!
    windGusts: Float!
    cloudCover: Float!
    sunshineHours: Float!
    waveHeight: Float
    wavePeriod: Float
  }

  type ActivityScore {
    activity: Activity!
    score: Int!
    rating: Rating!
    reasons: [String!]!
  }

  type RankedDay {
    date: String!
    weather: DailyWeather!
    activities: [ActivityScore!]!
  }

  type DestinationRanking {
    location: Location!
    generatedAt: String!
    days: [RankedDay!]!
  }

  type Query {
    health: String!
    destinationRanking(city: String!): DestinationRanking!
  }
`;
