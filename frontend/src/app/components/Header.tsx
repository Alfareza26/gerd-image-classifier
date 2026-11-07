'use client';

import { nav } from '../lib/data';
import Icon from './Icon';

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {}
}

export default function Header() {
  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <a href="#beranda" className="brand">
          <span className="logo"><Icon name="stomach" size={22} /></span>
          <span className="brand-name">GERD AI - Medical Image Classifier</span>
        </a>
        <nav className="nav" aria-label="Navigasi utama">
          {nav.map((n, i) => (
            <a key={n.label} href={n.href} aria-current={i === 0 ? 'page' : undefined}>{n.label}</a>
          ))}
        </nav>
        <div className="actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Ganti mode terang/gelap">
            <Icon name="sun" size={18} className="when-dark" />
            <Icon name="moon" size={18} className="when-light" />
          </button>
          <button className="icon-btn" aria-label="Notifikasi">
            <Icon name="bell" size={18} />
            <span className="dot" />
          </button>
          <a href="#analisis" className="btn btn-primary btn-sm">
            Mulai Analisis <Icon name="arrow" size={12} />
          </a>
        </div>
      </div>
    </header>
  );
}
