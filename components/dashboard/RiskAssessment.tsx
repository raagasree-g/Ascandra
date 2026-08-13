interface RiskAssessmentProps {
  risks: string[];
}

export default function RiskAssessment({
  risks,
}: RiskAssessmentProps) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div>
          <p className="card-label">Risk Assessment</p>
          <h2>Key Risks</h2>
        </div>
      </div>

      {risks.length === 0 ? (
        <p className="card-description">
          No significant risks were identified from the available information.
        </p>
      ) : (
        <ul className="risk-list">
          {risks.map((risk, index) => (
            <li key={`${risk}-${index}`}>
              <span className="risk-indicator" />
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}