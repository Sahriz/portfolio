import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from "@/components/theme-provider"

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Jonatan Ebenholm's Portfolio",
  description: "5th year student as Master of Science in Media Technology and Engineering - Portfolio showcasing projects in Computer Graphics, GPU programming, and game development",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
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