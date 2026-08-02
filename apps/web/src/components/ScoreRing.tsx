import type { CSSProperties } from 'react';

export function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="score-ring"
      style={{ '--score': `${score * 3.6}deg` } as CSSProperties}
      aria-label={`${score} out of 100`}
    >
      <span>{score}</span>
      <small>/100</small>
    </div>
  );
}
