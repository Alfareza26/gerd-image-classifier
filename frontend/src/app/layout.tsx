import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'GERD AI - Medical Image Classifier',
  description: 'Klasifikasi citra endoskopi dan deteksi dini refluks gastroesofagus (GERD) berbasis CNN.',
};

// Pilih tema sebelum paint supaya tidak berkedip: pilihan tersimpan, kalau tidak ada ikut sistem.
const themeScript = `try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
