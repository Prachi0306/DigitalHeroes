'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut',
      } 
    },
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-brand-500/30">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--brand-900),transparent_60%)] opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-500/10 to-transparent blur-[120px] pointer-events-none" />
      
      {/* Navbar Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            H
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            HireTrack
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
          >
            Create Workspace
          </Link>
        </nav>
      </header>

      {/* Main Hero Area */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            Empowering modern startups. No more spreadsheets.
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent"
          >
            Simplify your hiring pipeline.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
          >
            HireTrack is a collaborative, real-time Applicant Tracking System built for engineering and product teams to scout, interview, and hire high-impact candidates.
          </motion.p>

          {/* Call-to-action buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-brand-500 hover:to-brand-400 transition"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-full border border-zinc-800 bg-zinc-900/40 px-8 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-900/80 hover:text-white transition backdrop-blur-md"
            >
              Access Demo Workspace
            </Link>
          </motion.div>
        </motion.div>

        {/* Dynamic preview dashboard mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-indigo-500/5 rounded-2xl pointer-events-none" />
          
          {/* Mockup Toolbar */}
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800/80 text-zinc-500">
            <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
            <span className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/30" />
            <span className="ml-4 text-xs font-mono tracking-wider">hiretrack.app/dashboard/acme</span>
          </div>

          {/* Mockup Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-zinc-400 text-xs">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-zinc-500">Active Openings</span>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-[10px] text-brand-400">↑ 3 new this week</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-zinc-500">Total Applications</span>
              <div className="text-2xl font-bold text-white">148</div>
              <div className="text-[10px] text-zinc-500">Across all active jobs</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-zinc-500">Interviews Scheduled</span>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-[10px] text-emerald-400">✓ Today</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-zinc-500">Time-to-Hire</span>
              <div className="text-2xl font-bold text-white">21 days</div>
              <div className="text-[10px] text-zinc-500">8 days below avg</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 py-12 text-center text-sm text-zinc-600 bg-zinc-950/60 backdrop-blur-md">
        <p>© 2026 HireTrack. Designed for high performance teams.</p>
      </footer>
    </div>
  );
}
