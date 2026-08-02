import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'urql';
import { App } from './App';
import { graphQLClient } from './graphql/client';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider value={graphQLClient}>
      <App />
    </Provider>
  </StrictMode>,
);
