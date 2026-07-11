import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata: Metadata = {
  title: 'HireTrack — Unified Startup Hiring Platform & ATS',
  description:
    'HireTrack is a modern, developer-first Applicant Tracking System built to eliminate chaos from hiring workflows with real-time collaboration and live analytics.',
  keywords: 'ATS, applicant tracking system, startup recruiting, hiring software, developer jobs, recruiter tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <ThemeProvider defaultTheme="system" storageKey="hiretrack-theme">
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
