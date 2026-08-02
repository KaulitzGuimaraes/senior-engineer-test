import { Sparkles } from 'lucide-react';

interface BrandProps {
  footer?: boolean;
  href?: string;
}

export function Brand({ footer = false, href = '#top' }: BrandProps) {
  return (
    <a
      className={`brand${footer ? ' footer-brand' : ''}`}
      href={href}
      aria-label={footer ? undefined : 'Daymark home'}
    >
      <span className="brand-mark">
        <Sparkles size={18} />
      </span>
      <span>Daymark</span>
    </a>
  );
}
