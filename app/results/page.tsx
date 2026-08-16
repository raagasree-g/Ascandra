"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AnyObject = Record<string, any>;

function asObject(value: unknown): AnyObject {
  return value && typeof value === "object"
    ? (value as AnyObject)
    : {};
}

function asText(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") return value;

  if (typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  return String(value);
}

function getRiskClass(value: string) {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("high") ||
    normalized.includes("critical")
  ) {
    return "status-danger";
  }

  if (
    normalized.includes("medium") ||
    normalized.includes("watch") ||
    normalized.includes("attention")
  ) {
    return "status-warning";
  }

  if (
    normalized.includes("low") ||
    normalized.includes("healthy") ||
    normalized.includes("good")
  ) {
    return "status-success";
  }

  return "status-neutral";
}

function formatCurrency(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return asText(value);
  }

  return `₹${number.toLocaleString("en-IN")}`;
}

export default function ResultsPage() {
  const [data, setData] = useState<AnyObject | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    const stored =
      sessionStorage.getItem("ascandra-analysis");

    if (!stored) {
      setData(null);
      return;
    }

    try {
      setData(JSON.parse(stored));
    } catch {
      setData(null);
    }
  }, []);

  const sections = useMemo(() => {
    if (!data) {
      return {
        financialDecision: {},
        creditRisk: {},
        cashFlow: {},
        businessIntake: {},
      };
    }

    return {
      financialDecision:
        asObject(
          data.financial_decision_response,
        ).decision
          ? asObject(
              data.financial_decision_response,
            )
          : asObject(data.financial_decision),

      creditRisk:
        asObject(data.credit_tracker).overall_credit_risk
          ? asObject(data.credit_tracker)
          : asObject(data.credit_risk),

      cashFlow:
        asObject(data.cash_flow).cash_flow_status
          ? asObject(data.cash_flow)
          : asObject(data.cash_flow_analysis),

      businessIntake: asObject(
        data.business_intake,
      ),
    };
  }, [data]);

  if (!data) {
    return (
      <main className="results-page">
        <div className="empty-results">
          <div className="empty-icon">✦</div>

          <h1>No analysis found</h1>

          <p>
            Start a new business analysis to see
            Ascandra's recommendations here.
          </p>

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

  const {
    financialDecision,
    creditRisk,
    cashFlow,
    businessIntake,
  } = sections;

const recommendedActions = Array.isArray(
  financialDecision.recommended_actions
)
  ? financialDecision.recommended_actions
  : [];

const decision =
  financialDecision.decision ||
  recommendedActions[0] ||
  financialDecision.primary_issue ||
  financialDecision.financial_status ||
  "Analysis completed";

  const decisionReason =
    financialDecision.reasoning ||
    financialDecision.primary_issue ||
    financialDecision.decision ||
    "Ascandra completed the analysis.";

  const risk =
    creditRisk.overall_credit_risk ||
    creditRisk.main_risk ||
    "Not available";

  const riskReason =
    creditRisk.main_risk ||
    creditRisk.reasoning ||
    "No detailed credit-risk explanation was returned.";

  const cashStatus =
    cashFlow.cash_flow_status ||
    cashFlow.cash_flow_risk ||
    cashFlow.status ||
    "Analyzed";

  const actions = Array.isArray(
    financialDecision.recommended_actions,
  )
    ? financialDecision.recommended_actions
    : [];

  const additionalInfo = Array.isArray(
    creditRisk.additional_information_required,
  )
    ? creditRisk.additional_information_required
    : [];

  const businessType =
    businessIntake.business_type ||
    businessIntake.businessType ||
    "";

  const products =
    businessIntake.products ||
    businessIntake.product_services ||
    "";

  const monthlyRevenue =
    financialDecision.monthly_revenue ||
    cashFlow.monthly_revenue;

  const currentCash =
    cashFlow.current_cash_balance ??
    financialDecision.current_cash_balance;

  const customerDue =
    creditRisk.customer_amount_due ??
    financialDecision.customer_amount_due;

  return (
    <main className="results-page">
      <div className="results-shell">

        {/* HEADER */}

        <header className="results-topbar">
          <Link
            href="/analyze"
            className="back-link"
          >
            ← New analysis
          </Link>

          <div className="brand-mark">
            <span className="brand-dot" />
            <span>Ascandra</span>
          </div>
        </header>

        <section className="results-hero">
          <div>
            <p className="eyebrow">
              BUSINESS DECISION REPORT
            </p>

            <h1>
              Your business,
              <br />
              understood.
            </h1>

            <p className="hero-description">
              Ascandra reviewed the information you
              provided and identified the most important
              things to act on.
            </p>
          </div>

          <div className="hero-badge">
            <span>✓</span>
            Analysis complete
          </div>
        </section>

        {/* TOP STATUS CARDS */}

        <section className="status-grid">

          <div className="status-card decision-card">
            <div className="status-card-top">
              <span className="status-icon">◆</span>
              <span className="status-label">
                Decision
              </span>
            </div>

            <strong>
              {asText(decision)}
            </strong>

            <p>
              What Ascandra thinks you should
              focus on first.
            </p>
          </div>

          <div className="status-card">
            <div className="status-card-top">
              <span className="status-icon">
                ◐
              </span>

              <span className="status-label">
                Credit risk
              </span>
            </div>

            <strong
              className={getRiskClass(
                asText(risk),
              )}
            >
              {asText(risk)}
            </strong>

            <p>
              Based on the payment and credit
              information provided.
            </p>
          </div>

          <div className="status-card">
            <div className="status-card-top">
              <span className="status-icon">
                ◔
              </span>

              <span className="status-label">
                Cash flow
              </span>
            </div>

            <strong
              className={getRiskClass(
                asText(cashStatus),
              )}
            >
              {asText(cashStatus)}
            </strong>

            <p>
              How your incoming and outgoing
              money currently looks.
            </p>
          </div>

        </section>

        {/* MAIN DECISION */}

        <section className="decision-panel">

          <div className="decision-panel-header">
            <div>
              <span className="section-kicker">
                MOST IMPORTANT
              </span>

              <h2>
                What should you do?
              </h2>
            </div>

            <div className="decision-badge">
              {asText(
                financialDecision.financial_status ||
                  financialDecision.priority ||
                  "ACTION",
              )}
            </div>
          </div>

          <p className="decision-main">
            {asText(decision)}
          </p>

          <div className="decision-explanation">
            <span>Why this matters</span>

            <p>
              {asText(decisionReason)}
            </p>
          </div>

        </section>

        {/* RECOMMENDED ACTIONS */}

        <section className="content-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                NEXT STEPS
              </span>

              <h2>
                What to do next
              </h2>
            </div>

            <span className="action-count">
              {actions.length} actions
            </span>
          </div>

          {actions.length > 0 ? (
            <div className="actions-list">
              {actions.map(
                (action: unknown, index: number) => (
                  <div
                    className="action-item"
                    key={index}
                  >
                    <div className="action-number">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </div>

                    <div className="action-content">
                      <p>
                        {asText(action)}
                      </p>
                    </div>

                    <div className="action-arrow">
                      →
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="soft-empty">
              No specific actions were returned.
            </div>
          )}

        </section>

        {/* TWO COLUMN INFORMATION */}

        <section className="two-column">

          <div className="info-card">

            <div className="info-card-heading">
              <span className="info-icon">
                ◐
              </span>

              <div>
                <span className="section-kicker">
                  CREDIT
                </span>

                <h2>
                  Credit risk
                </h2>
              </div>
            </div>

            <div
              className={`risk-pill ${getRiskClass(
                asText(risk),
              )}`}
            >
              {asText(risk)}
            </div>

            <p className="info-description">
              {asText(riskReason)}
            </p>

          </div>

          <div className="info-card">

            <div className="info-card-heading">
              <span className="info-icon">
                +
              </span>

              <div>
                <span className="section-kicker">
                  NEED MORE INFORMATION
                </span>

                <h2>
                  What would help?
                </h2>
              </div>
            </div>

            {additionalInfo.length > 0 ? (
              <ul className="clean-list">
                {additionalInfo.map(
                  (
                    item: unknown,
                    index: number,
                  ) => (
                    <li key={index}>
                      <span>•</span>
                      {asText(item)}
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="info-description">
                No additional information was
                requested.
              </p>
            )}

          </div>

        </section>

        {/* BUSINESS SNAPSHOT */}

        {(businessType ||
          products ||
          monthlyRevenue ||
          currentCash ||
          customerDue) && (
          <section className="snapshot-card">

            <div className="snapshot-header">
              <div>
                <span className="section-kicker">
                  YOUR BUSINESS
                </span>

                <h2>
                  Business snapshot
                </h2>
              </div>
            </div>

            <div className="snapshot-grid">

              {businessType && (
                <div className="snapshot-item">
                  <span>Business</span>
                  <strong>
                    {asText(businessType)}
                  </strong>
                </div>
              )}

              {products && (
                <div className="snapshot-item">
                  <span>Products / services</span>
                  <strong>
                    {asText(products)}
                  </strong>
                </div>
              )}

              {monthlyRevenue && (
                <div className="snapshot-item">
                  <span>Monthly revenue</span>
                  <strong>
                    {formatCurrency(
                      monthlyRevenue,
                    ) ||
                      asText(monthlyRevenue)}
                  </strong>
                </div>
              )}

              {currentCash !== undefined &&
                currentCash !== null && (
                  <div className="snapshot-item">
                    <span>Cash available</span>
                    <strong>
                      {formatCurrency(
                        currentCash,
                      ) ||
                        asText(currentCash)}
                    </strong>
                  </div>
                )}

              {customerDue !== undefined &&
                customerDue !== null && (
                  <div className="snapshot-item">
                    <span>Customer payments due</span>
                    <strong>
                      {formatCurrency(
                        customerDue,
                      ) ||
                        asText(customerDue)}
                    </strong>
                  </div>
                )}

            </div>

          </section>
        )}

        {/* RAW DATA */}

        <section className="technical-section">

          <button
            type="button"
            className="technical-toggle"
            onClick={() =>
              setShowRaw((current) => !current)
            }
            aria-expanded={showRaw}
          >
            <div>
              <span className="section-kicker">
                FOR TRANSPARENCY
              </span>

              <strong>
                Technical analysis
              </strong>

              <span>
                View the detailed data returned
                by Ascandra
              </span>
            </div>

            <span className="toggle-arrow">
              {showRaw ? "↑" : "↓"}
            </span>
          </button>

          {showRaw && (
            <pre className="json-box">
              {JSON.stringify(
                data,
                null,
                2,
              )}
            </pre>
          )}

        </section>

        {/* FOOTER CTA */}

        <section className="results-footer">

          <div>
            <h2>
              Ready to look at another business?
            </h2>

            <p>
              You can start a new analysis whenever
              you need.
            </p>
          </div>

          <Link
            href="/analyze"
            className="primary-button"
          >
            Analyze another business →
          </Link>

        </section>

        <footer className="results-footer-note">
          Ascandra helps you understand your business
          information. Use its recommendations as
          decision support, not as a replacement for
          professional financial advice.
        </footer>

      </div>
    </main>
  );
}