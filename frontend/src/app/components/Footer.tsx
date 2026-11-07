import { footerLinks } from '../lib/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <p>
          <b>GERD AI Diagnostic Systems</b>
          <span aria-hidden="true"> • </span>
          © {new Date().getFullYear()} GERD AI Diagnostic Systems. Platform Khusus Tenaga Medis Terverifikasi.
        </p>
        <nav aria-label="Tautan footer">
          {footerLinks.map((l) => <a key={l} href="#">{l}</a>)}
        </nav>
      </div>
    </footer>
  );
}
