'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  UserPlus,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Active Openings',
      value: '12',
      change: '+3 this week',
      trend: 'up',
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      name: 'Total Candidates',
      value: '148',
      change: '+18% vs last month',
      trend: 'up',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      name: 'Upcoming Interviews',
      value: '6',
      change: '2 scheduled today',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      name: 'Acceptance Rate',
      value: '78%',
      change: '+4% vs average',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  const recentCandidates = [
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Senior React Developer',
      stage: 'Interview',
      stageColor: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      time: '2 hours ago',
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Lead Cloud Engineer',
      stage: 'Screening',
      stageColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      time: '5 hours ago',
    },
    {
      id: '3',
      name: 'Charlie Brown',
      role: 'Product Manager',
      stage: 'Applied',
      stageColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      time: '1 day ago',
    },
    {
      id: '4',
      name: 'Diana Prince',
      role: 'QA Automation Lead',
      stage: 'Offer',
      stageColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      time: '2 days ago',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Job',
      desc: 'Publish a new opening to your careers board',
      href: '/dashboard/jobs',
      icon: Plus,
      color: 'bg-brand-500 text-white',
    },
    {
      title: 'Add Candidate',
      desc: 'Upload resume or add a profile manually',
      href: '/dashboard/candidates',
      icon: UserPlus,
      color: 'bg-accent text-foreground hover:bg-accent/80',
    },
    {
      title: 'Schedule Interview',
      desc: 'Link calendars and setup panel sessions',
      href: '/dashboard/interviews',
      icon: Clock,
      color: 'bg-accent text-foreground hover:bg-accent/80',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header welcome banner */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {user?.firstName || 'User'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is a high-level summary of your workspace recruitment activities today.
        </p>
      </div>

      {/* Grid of Key Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              variants={itemVariants}
              key={stat.name}
              className="p-6 rounded-lg bg-card border border-border shadow-xs flex flex-col justify-between hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
                <div className={`h-9 w-9 rounded-md flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Overview Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Pipeline Activity */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-card border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">Recent Pipeline Activity</h3>
            <Link
              href="/dashboard/candidates"
              className="text-xs font-semibold text-brand-500 flex items-center gap-1 hover:underline"
            >
              View talent pool <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {recentCandidates.map((candidate) => (
              <div key={candidate.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground hover:text-brand-500 cursor-pointer transition">
                    {candidate.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{candidate.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${candidate.stageColor}`}>
                    {candidate.stage}
                  </span>
                  <span className="text-xs text-muted-foreground min-w-[70px] text-right">
                    {candidate.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Widget Panels */}
        <div className="p-6 rounded-lg bg-card border border-border shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>
          
          <div className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`flex items-start gap-4 p-4 rounded-lg border border-border hover:border-brand-500/30 transition group ${
                    action.color.includes('bg-brand') ? 'bg-brand-500 text-white border-transparent' : 'bg-card'
                  }`}
                >
                  <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${
                    action.color.includes('bg-brand') ? 'bg-white/20' : 'bg-accent'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight flex items-center gap-1">
                      {action.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1 duration-200" />
                    </h4>
                    <p className={`text-xs mt-1 leading-normal ${
                      action.color.includes('bg-brand') ? 'text-brand-100' : 'text-muted-foreground'
                    }`}>
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
