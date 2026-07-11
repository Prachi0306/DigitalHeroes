'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  Briefcase,
  Users,
  Calendar,
  Settings,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuthApi } from '@/hooks/use-auth-api';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const { logout } = useAuthApi();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Layers },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/dashboard/candidates', icon: Users },
    { name: 'Interviews', href: '/dashboard/interviews', icon: Calendar },
    { name: 'Team', href: '/dashboard/team', icon: Shield },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <motion.div
      animate={{ width: sidebarOpen ? 240 : 70 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-card border-r border-border shrink-0 select-none overflow-hidden"
    >
      {/* Brand logo bar */}
      <div className="flex items-center h-16 px-4 border-b border-border gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-white shadow-md">
          H
        </div>
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            HireTrack
          </motion.span>
        )}
      </div>

      {/* Nav List links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center h-10 px-3 rounded-md text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3"
                >
                  {item.name}
                </motion.span>
              )}

              {/* Tooltip on collapse hover */}
              {!sidebarOpen && (
                <div className="absolute left-16 scale-0 rounded bg-zinc-950 px-2 py-1 text-xs text-white group-hover:scale-100 transition shadow-md z-30 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile / Logout controls footer */}
      <div className="p-3 border-t border-border space-y-2">
        {sidebarOpen && user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-accent/40">
            <div className="h-9 w-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-600">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => logout.mutate()}
          className="flex items-center w-full h-10 px-3 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition group relative"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span className="ml-3">Sign Out</span>}
          {!sidebarOpen && (
            <div className="absolute left-16 scale-0 rounded bg-red-600 px-2 py-1 text-xs text-white group-hover:scale-100 transition shadow-md z-30 whitespace-nowrap">
              Sign Out
            </div>
          )}
        </button>
      </div>

      {/* Mini Toggle Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center shadow-sm cursor-pointer hover:bg-accent transition z-20"
      >
        {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    </motion.div>
  );
}
