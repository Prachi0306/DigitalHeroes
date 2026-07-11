'use client';

import React from 'react';
import { useTheme } from '@/providers/theme-provider';
import { useAuthStore } from '@/stores/auth-store';
import { Sun, Moon, Bell, HelpCircle } from 'lucide-react';

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 select-none">
      {/* Page location context */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">Dashboard</span>
        <span className="text-zinc-400">/</span>
        <span className="text-sm font-medium text-muted-foreground">Overview</span>
      </div>

      {/* Utility Actions */}
      <div className="flex items-center gap-4">
        {/* Help icon */}
        <button className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-accent/60">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Bell notification */}
        <button className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-accent/60 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-card" />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-accent/60"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <span className="h-6 w-px bg-border" />

        {/* Current logged-in user context indicator */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.firstName[0] || 'U'}
          </div>
          <span className="text-xs font-semibold text-foreground hidden sm:block">
            {user?.firstName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
