export const destinationRankingQuery = /* GraphQL */ `
  query DestinationRanking($city: String!) {
    destinationRanking(city: $city) {
      generatedAt
      location {
        name
        country
        region
        latitude
        longitude
        timezone
      }
      days {
        date
        weather {
          weatherCode
          temperatureMin
          temperatureMax
          precipitation
          snowfall
          windSpeed
          sunshineHours
          waveHeight
        }
        activities {
          activity
          score
          rating
          reasons
        }
      }
    }
  }
`;
