'use client';

// next-themes injects a small blocking script that sets .dark before the first paint.
// Re-exporting keeps every existing import of ThemeProvider / useTheme working unchanged.
export { ThemeProvider, useTheme } from 'next-themes';
