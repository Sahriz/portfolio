import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"

// next/font downloads the fonts at build time and serves them from the site itself.
const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

// Runs before first paint: if the intro already played this session, flag
// <html> so CSS can hide the curtain without a black flash.
const skipIntroScript =
  "try{if(sessionStorage.getItem('intro-seen'))document.documentElement.classList.add('skip-intro')}catch(e){}";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Jonatan Ebenholm's Portfolio",
  description: "5th year student as Master of Science in Media Technology and Engineering - Portfolio showcasing projects in Computer Graphics, GPU programming, and game development",
  icons: {
    icon: '/browserTab.png',
    shortcut: '/browserTab.png',
    apple: '/browserTab.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable}`}>
        <head>
          <script dangerouslySetInnerHTML={{ __html: skipIntroScript }} />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}