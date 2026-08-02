import { ArrowRight } from 'lucide-react';
import { Brand } from './Brand';

export function SiteFooter() {
  return (
    <footer id="about">
      <div className="shell footer-grid">
        <div>
          <Brand footer />
          <p>Make more of the days ahead.</p>
        </div>
        <div>
          <span>Built with</span>
          <p>React · GraphQL · Open-Meteo</p>
        </div>
        <div>
          <span>Data</span>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
