import React from 'react';
import './globals.css';

export const metadata = {
  title: 'GERD Image Classifier - AI untuk Analisis Citra Endoskopi Medis',
  description: 'Sistem klasifikasi citra medis berbasis deep learning untuk membantu analisis tanda-tanda yang berkaitan dengan GERD pada citra endoskopi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#faf8ff] text-[#131b2e] antialiased min-h-screen selection:bg-[#cce5ff] selection:text-[#001d31]">
      {children}
    </div>
  );
}
