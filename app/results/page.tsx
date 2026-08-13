"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AnalysisData = Record<string, unknown>;

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("ascandra-analysis");

    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(null);
      }
    }
  }, []);

  if (!data) {
    return (
      <main className="loading">
        <div>
          <p>No analysis found.</p>
          <br />
          <Link href="/analyze" className="primary-button">
            Start Analysis
          </Link>
        </div>
      </main>
    );
  }

  const financialDecision =
    (data.financial_decision_response as Record<string, unknown>) ||
    (data.financial_decision as Record<string, unknown>) ||
    {};

  const creditRisk =
    (data.credit_tracker as Record<string, unknown>) ||
    (data.credit_risk as Record<string, unknown>) ||
    {};

  const cashFlow =
    (data.cash_flow as Record<string, unknown>) ||
    (data.cash_flow_analysis as Record<string, unknown>) ||
    {};

  const decision =
    financialDecision.decision ||
    financialDecision.primary_issue ||
    "Analysis completed";

  const risk =
    creditRisk.overall_credit_risk ||
    creditRisk.main_risk ||
    "Not available";

  return (
    <main className="results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>Business Decision Dashboard</h1>
          <p>
            Ascandra has analyzed the information provided for your business.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-label">Decision</div>
            <div className="metric-value">
              {String(decision)}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Credit Risk</div>
            <div className="metric-value">
              {String(risk)}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Cash Flow</div>
            <div className="metric-value">
              {String(
                cashFlow.cash_flow_status ||
                  cashFlow.cash_flow_risk ||
                  "Analyzed",
              )}
            </div>
          </div>
        </div>

        <section className="result-section">
          <h2>Financial Decision</h2>

          <p>
            {String(
              financialDecision.reasoning ||
                financialDecision.primary_issue ||
                financialDecision.decision ||
                "No detailed decision was returned.",
            )}
          </p>
        </section>

        <section className="result-section">
          <h2>Recommended Actions</h2>

          {Array.isArray(financialDecision.recommended_actions) ? (
            <ul className="result-list">
              {financialDecision.recommended_actions.map(
                (action, index) => (
                  <li key={index}>{String(action)}</li>
                ),
              )}
            </ul>
          ) : (
            <p>No recommendations returned.</p>
          )}
        </section>

        <section className="result-section">
          <h2>Credit Risk</h2>

          <p>
            {String(
              creditRisk.main_risk ||
                creditRisk.reasoning ||
                "No detailed credit-risk assessment returned.",
            )}
          </p>
        </section>

        <section className="result-section">
          <h2>Additional Information Required</h2>

          {Array.isArray(
            creditRisk.additional_information_required,
          ) ? (
            <ul className="result-list">
              {creditRisk.additional_information_required.map(
                (item, index) => (
                  <li key={index}>{String(item)}</li>
                ),
              )}
            </ul>
          ) : (
            <p>No additional information requested.</p>
          )}
        </section>

        <section className="result-section">
          <h2>Raw Analysis</h2>

          <pre className="json-box">
            {JSON.stringify(data, null, 2)}
          </pre>
        </section>

        <br />

        <Link href="/analyze" className="secondary-button">
          Analyze Another Business
        </Link>
      </div>
    </main>
  );
}