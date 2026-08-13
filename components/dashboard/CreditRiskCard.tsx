interface CreditRiskCardProps {
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
  supplierRisk: string;
  customerCollectionRisk: string;
  timingMismatch: "YES" | "NO";
}

export default function CreditRiskCard({
  overallRisk,
  supplierRisk,
  customerCollectionRisk,
  timingMismatch,
}: CreditRiskCardProps) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <p className="card-label">Credit Risk</p>
          <h2>{overallRisk}</h2>
        </div>

        <span className="status-badge">{overallRisk}</span>
      </div>

      <div className="metric-list">
        <div>
          <span>Supplier Payment Risk</span>
          <strong>{supplierRisk}</strong>
        </div>

        <div>
          <span>Customer Collection Risk</span>
          <strong>{customerCollectionRisk}</strong>
        </div>

        <div>
          <span>Payment Timing Mismatch</span>
          <strong>{timingMismatch}</strong>
        </div>
      </div>
    </div>
  );
}