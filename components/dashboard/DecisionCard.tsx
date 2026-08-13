interface DecisionCardProps {
  decision: string;
  recommendedAction: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
}

export default function DecisionCard({
  decision,
  recommendedAction,
  confidence,
}: DecisionCardProps) {
  return (
    <div className="dashboard-card decision-card">
      <div className="card-header">
        <div>
          <p className="card-label">Ascandra Decision</p>
          <h2>{decision}</h2>
        </div>

        <span className="status-badge">
          {confidence} CONFIDENCE
        </span>
      </div>

      <div className="decision-content">
        <p className="decision-label">Recommended Action</p>

        <p className="decision-text">
          {recommendedAction}
        </p>
      </div>
    </div>
  );
}