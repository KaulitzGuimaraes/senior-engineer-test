import type { ActivityScore } from '../graphql/types';
import { activityDetails } from '../lib/presentation';
import { ScoreRing } from './ScoreRing';

export function ActivityRanking({
  activities,
}: {
  activities: ActivityScore[];
}) {
  return (
    <div className="recommendations-panel">
      <div className="panel-topline">
        <span>Activity ranking</span>
        <span>Best first</span>
      </div>
      <div className="activity-list">
        {activities.map((activity, index) => {
          const detail = activityDetails[activity.activity];
          const Icon = detail.icon;

          return (
            <article className="activity-card" key={activity.activity}>
              <div className="activity-rank">0{index + 1}</div>
              <div className="activity-icon">
                <Icon />
              </div>
              <div className="activity-copy">
                <span>
                  {detail.eyebrow} · {activity.rating.toLowerCase()}
                </span>
                <h3>{detail.label}</h3>
                <p>{activity.reasons[0]}</p>
              </div>
              <ScoreRing score={activity.score} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
