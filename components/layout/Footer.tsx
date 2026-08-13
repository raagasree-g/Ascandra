export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <strong>Ascandra</strong>
          <p>
            AI-powered financial decision intelligence for small businesses.
          </p>
        </div>

        <p>
          © {new Date().getFullYear()} Ascandra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}