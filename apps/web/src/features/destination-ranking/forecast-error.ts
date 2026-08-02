export interface ForecastError {
  kind: 'client' | 'not-found' | 'server';
  message: string;
  status: number;
}

interface ForecastQueryError {
  graphQLErrors: ReadonlyArray<{
    extensions: Readonly<Record<string, unknown>>;
    message: string;
  }>;
  message: string;
  networkError?: Error;
  response?: { status: number };
}

export const toForecastError = (
  error: ForecastQueryError | undefined,
): ForecastError | undefined => {
  if (!error) return undefined;

  const graphQLError = error.graphQLErrors[0];
  const code = graphQLError?.extensions['code'];
  const extensionStatus = graphQLError?.extensions['status'];
  const responseStatus = error.response?.status;
  const status =
    typeof extensionStatus === 'number'
      ? extensionStatus
      : (responseStatus ?? (error.networkError ? 503 : 500));
  const message =
    graphQLError?.message ?? error.networkError?.message ?? error.message;

  if (code === 'NOT_FOUND' || status === 404) {
    return { kind: 'not-found', message, status: 404 };
  }

  if (code === 'BAD_USER_INPUT' || (status >= 400 && status < 500)) {
    return { kind: 'client', message, status };
  }

  return { kind: 'server', message, status };
};
