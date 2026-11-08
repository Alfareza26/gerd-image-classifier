"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [["/", "Beranda"], ["/analisis", "Analisis"], ["/riwayat", "Riwayat"], ["/profil", "Profil"]] as const;

export default function SiteHeader() {
  const path = usePathname();
  return (
    <header className="site-header no-print">
      <div className="wrap">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt="" width={36} height={36} className="logo logo-light" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="" width={36} height={36} className="logo logo-dark" />
          GERD AI 
        </Link>
        <nav className="nav" aria-label="Utama">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
          ))}
          <ThemeToggle />
          <Link href="/analisis" className="btn btn-primary">Mulai Analisis</Link>
        </nav>
      </div>
    </header>
  );
}
