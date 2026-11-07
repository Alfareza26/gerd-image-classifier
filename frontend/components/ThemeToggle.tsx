"use client";
export default function ThemeToggle() {
  const flip = () => {
    const el = document.documentElement;
    const dark = el.dataset.theme ? el.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    el.dataset.theme = next;
    try { localStorage.setItem("gerd.theme", next); } catch {}
  };
  return <button className="icon-btn no-print" onClick={flip} aria-label="Ganti mode terang atau gelap" title="Terang / gelap">◐</button>;
}
