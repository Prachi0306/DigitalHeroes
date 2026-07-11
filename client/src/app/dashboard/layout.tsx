'use client';

import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Navigation sidebar panel */}
      <Sidebar />

      {/* Main panel layout */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Topbar navigation indicators */}
        <Topbar />

        {/* Scrollable central content */}
        <main className="flex-1 overflow-y-auto p-6 focus:outline-none bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
