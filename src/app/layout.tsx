import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import SiteHeader from "@/components/SiteHeader"

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

// The favicon is src/app/icon.svg (Next picks it up by file name).
// Open Graph image URLs need an absolute base. On Vercel, Next derives it from
// the deployment URL; set `metadataBase` here if the site moves elsewhere.
export const metadata: Metadata = {
  title: {
    default: 'Jonatan Ebenholm — Systems and software engineer',
    template: '%s · Jonatan Ebenholm',
  },
  description:
    'Jonatan Ebenholm, systems and software engineer finishing an MSc in Media Technology and Engineering at Linköping University. Projects in computer graphics, GPU programming and simulation.',
  openGraph: {
    type: 'website',
    siteName: 'Jonatan Ebenholm',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Procedural terrain rendered in WebGL' }],
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
            <SiteHeader />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}