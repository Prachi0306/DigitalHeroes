'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
      {/* Brand Section - Left Side */}
      <div className="relative hidden w-full md:flex md:w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white overflow-hidden border-r border-zinc-800">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-900),transparent_50%)] opacity-30" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-500 rounded-full blur-[120px] opacity-20" />
        
        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            H
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            HireTrack
          </span>
        </div>

        {/* Dynamic hero center content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-br from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent"
          >
            Hire premium talent. Faster.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 text-lg"
          >
            A unified recruiting ecosystem designed for modern hiring teams. Collaborate, streamline pipelines, and make data-driven offers without the friction.
          </motion.p>
          
          {/* A sleek card preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-zinc-300">
                JD
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-100">Jane Doe</h4>
                <p className="text-xs text-zinc-500">Senior Product Designer</p>
              </div>
              <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Offer Stage
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-zinc-500 flex justify-between">
          <span>© 2026 HireTrack Inc.</span>
          <span className="hover:text-zinc-300 transition cursor-pointer">Privacy & Terms</span>
        </div>
      </div>

      {/* Forms Section - Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
