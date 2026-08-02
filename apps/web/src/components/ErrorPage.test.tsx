import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('NotFoundPage', () => {
  it('renders a useful recovery page for an unknown route', () => {
    const markup = renderToStaticMarkup(<App pathname="/missing" />);

    expect(markup).toContain('404');
    expect(markup).toContain('You’ve wandered off the map.');
    expect(markup).toContain('href="/"');
    expect(markup).toContain('Return to the forecast');
  });
});
