interface BusinessHealthProps {
  score: number;
  status: "HEALTHY" | "MODERATE" | "AT RISK";
}

export default function BusinessHealth({
  score,
  status,
}: BusinessHealthProps) {
  return (
    <div className="dashboard-card business-health-card">
      <div className="card-header">
        <div>
          <p className="card-label">Business Health</p>
          <h2>{score}/100</h2>
        </div>

        <span className="status-badge">{status}</span>
      </div>

      <div className="health-bar">
        <div
          className="health-progress"
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>

      <p className="card-description">
        Overall assessment based on profitability, liquidity, credit exposure,
        and payment timing.
      </p>
    </div>
  );
}