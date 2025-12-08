import '../styles/styles.css';
import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "Jonatan Ebenholm's Portfolio",
  description: "5th year student as Master of Science in Media Technology and Engineering - Portfolio showcasing projects in Computer Graphics, GPU programming, and game development",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
