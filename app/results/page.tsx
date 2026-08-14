"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AnalysisData = Record<string, any>;

export default function ResultsPage() {
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(
      "ascandra-analysis",
    );

    console.log(
      "RESULTS PAGE DATA:",
      stored,
    );

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      console.log(
        "PARSED RESULTS:",
        parsed,
      );

      setData(parsed);
    } catch (error) {
      console.error(
        "Failed to parse analysis:",
        error,
      );
    }
  }, []);

  // --------------------------------------------------
  // NO ANALYSIS DATA
  // --------------------------------------------------

  if (!data) {
    return (
      <main className="loading">
        <div>
          <h1>
            Business Decision Dashboard
          </h1>

          <p>
            No analysis data found.
          </p>

          <br />

          <Link
            href="/analyze"
            className="primary-button"
          >
            Start Analysis
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // EXTRACT N8N DATA
  // --------------------------------------------------

  const businessIntake =
    data.business_intake || {};

  const creditTracker =
    data.credit_tracker || {};

  const cashFlow =
    data.cash_flow || {};

  const financialDecisionContainer =
    data.financial_decision || {};

  const financialDecision =
    financialDecisionContainer
      .financial_decision_response ||
    financialDecisionContainer ||
    {};

  // --------------------------------------------------
  // DECISION
  // --------------------------------------------------

  const decision =
    financialDecision.decision ||
    financialDecision.primary_issue ||
    financialDecision.financial_status ||
    "Analysis completed";

  // --------------------------------------------------
  // CREDIT RISK
  // --------------------------------------------------

  const creditRisk =
    creditTracker.overall_credit_risk ||
    creditTracker.main_risk ||
    "Not available";

  // --------------------------------------------------
  // CASH FLOW
  // --------------------------------------------------

  const cashFlowStatus =
    cashFlow.cash_flow_status ||
    cashFlow.cash_flow_risk ||
    "Analyzed";

  // --------------------------------------------------
  // FINANCIAL REASONING
  // --------------------------------------------------

  const financialReasoning =
    financialDecision.reasoning ||
    financialDecision.primary_issue ||
    financialDecision.decision ||
    "No detailed financial decision was returned.";

  // --------------------------------------------------
  // RECOMMENDED ACTIONS
  // --------------------------------------------------

  const recommendedActions =
    Array.isArray(
      financialDecision.recommended_actions,
    )
      ? financialDecision.recommended_actions
      : [];

  // --------------------------------------------------
  // ADDITIONAL INFORMATION
  // --------------------------------------------------

  const additionalInformation =
    Array.isArray(
      creditTracker.additional_information_required,
    )
      ? creditTracker.additional_information_required
      : [];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="results-page">
      <div className="results-container">

        {/* HEADER */}

        <div className="results-header">

          <h1>
            Business Decision Dashboard
          </h1>

          <p>
            Ascandra has analyzed the
            information provided for your
            business.
          </p>

        </div>

        {/* METRICS */}

        <div className="dashboard-grid">

          <div className="metric-card">

            <div className="metric-label">
              Decision
            </div>

            <div className="metric-value">
              {String(decision)}
            </div>

          </div>

          <div className="metric-card">

            <div className="metric-label">
              Credit Risk
            </div>

            <div className="metric-value">
              {String(creditRisk)}
            </div>

          </div>

          <div className="metric-card">

            <div className="metric-label">
              Cash Flow
            </div>

            <div className="metric-value">
              {String(cashFlowStatus)}
            </div>

          </div>

        </div>

        {/* FINANCIAL DECISION */}

        <section className="result-section">

          <h2>
            Financial Decision
          </h2>

          <p>
            {String(financialReasoning)}
          </p>

        </section>

        {/* RECOMMENDED ACTIONS */}

        <section className="result-section">

          <h2>
            Recommended Actions
          </h2>

          {recommendedActions.length > 0 ? (

            <ul className="result-list">

              {recommendedActions.map(
                (
                  action: unknown,
                  index: number,
                ) => (
                  <li key={index}>
                    {String(action)}
                  </li>
                ),
              )}

            </ul>

          ) : (

            <p>
              No recommendations returned.
            </p>

          )}

        </section>

        {/* CREDIT RISK */}

        <section className="result-section">

          <h2>
            Credit Risk
          </h2>

          <p>
            {String(
              creditTracker.main_risk ||
              creditTracker.reasoning ||
              "No detailed credit-risk assessment returned.",
            )}
          </p>

        </section>

        {/* ADDITIONAL INFORMATION */}

        <section className="result-section">

          <h2>
            Additional Information Required
          </h2>

          {additionalInformation.length > 0 ? (

            <ul className="result-list">

              {additionalInformation.map(
                (
                  item: unknown,
                  index: number,
                ) => (
                  <li key={index}>
                    {String(item)}
                  </li>
                ),
              )}

            </ul>

          ) : (

            <p>
              No additional information requested.
            </p>

          )}

        </section>

        {/* BUSINESS INTAKE */}

        {businessIntake.text && (

          <section className="result-section">

            <h2>
              Business Intake
            </h2>

            <p>
              {String(
                businessIntake.text,
              )}
            </p>

          </section>

        )}

        {/* RAW ANALYSIS */}

        <section className="result-section">

          <h2>
            Raw Analysis
          </h2>

          <pre className="json-box">
            {JSON.stringify(
              data,
              null,
              2,
            )}
          </pre>

        </section>

        {/* BACK */}

        <br />

        <Link
          href="/analyze"
          className="secondary-button"
        >
          Analyze Another Business
        </Link>

      </div>
    </main>
  );
}