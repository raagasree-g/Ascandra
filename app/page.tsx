import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <nav className="navbar">
        <div className="logo">Ascandra</div>

        <Link href="/analyze" className="nav-link">
          Analyze Business
        </Link>
      </nav>

      <section className="hero">
        <span className="badge">AI Business Decision Intelligence</span>

        <h1>Make better business decisions with your numbers.</h1>

        <p>
          Ascandra analyzes your business information, cash flow, credit
          exposure, risks and operating data to turn raw information into
          actionable decisions.
        </p>

        <Link href="/analyze" className="primary-button">
          Analyze My Business
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Financial Intelligence</h3>
          <p>
            Understand revenue, costs, margins, cash position and financial
            pressure.
          </p>
        </div>

        <div className="feature-card">
          <h3>Risk Detection</h3>
          <p>
            Identify liquidity gaps, credit exposure, collection problems and
            timing mismatches.
          </p>
        </div>

        <div className="feature-card">
          <h3>Actionable Decisions</h3>
          <p>
            Convert business data into clear recommendations and decisions.
          </p>
        </div>
      </section>
    </main>
  );
}