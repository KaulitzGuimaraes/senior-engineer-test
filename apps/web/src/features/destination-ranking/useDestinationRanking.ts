import { useState, type FormEvent } from 'react';
import { useQuery } from 'urql';
import { destinationRankingQuery } from '../../graphql/destination-ranking.query';
import type { DestinationRankingData } from '../../graphql/types';
import { toForecastError } from './forecast-error';

const DEFAULT_CITY = 'Lisbon';

export function useDestinationRanking() {
  const [input, setInput] = useState(DEFAULT_CITY);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [selectedDay, setSelectedDay] = useState(0);
  const [{ data, fetching, error }, refreshRanking] =
    useQuery<DestinationRankingData>({
      query: destinationRankingQuery,
      variables: { city },
      requestPolicy: 'network-only',
    });

  const showForecast = () => {
    requestAnimationFrame(() => {
      document
        .getElementById('forecast')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const search = (value: string) => {
    const destination = value.trim();
    if (!destination) return;

    setSelectedDay(0);
    if (destination === city) {
      refreshRanking({ requestPolicy: 'network-only' });
    } else {
      setCity(destination);
    }
    showForecast();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(input);
  };

  const chooseCity = (value: string) => {
    setInput(value);
    search(value);
  };

  const ranking = data?.destinationRanking;

  const retry = () => {
    refreshRanking({ requestPolicy: 'network-only' });
    showForecast();
  };

  return {
    activeDay: ranking?.days[selectedDay] ?? ranking?.days[0],
    chooseCity,
    error: toForecastError(error),
    fetching,
    input,
    ranking,
    retry,
    selectedDay,
    setInput,
    setSelectedDay,
    submit,
  };
}
