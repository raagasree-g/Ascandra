import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          Ascandra
        </Link>

        <nav className="navbar-links">
          <Link href="/">Home</Link>
          <Link href="/analyze">Analyze</Link>
          <Link href="/results">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}