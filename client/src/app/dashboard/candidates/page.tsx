'use client';

import React, { useState } from 'react';
import { useCandidatesApi } from '@/hooks/use-candidates-api';
import { useJobsApi } from '@/hooks/use-jobs-api';
import AddCandidateModal from '@/components/candidates/add-candidate-modal';
import {
  Plus,
  Search,
  ArrowRightLeft,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

const PIPELINE_STAGES = [
  { id: 'applied', label: 'Applied', color: 'bg-slate-500/10 text-slate-700 border-slate-200 dark:text-slate-400 dark:border-slate-800' },
  { id: 'phone-screen', label: 'Phone Screen', color: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800/60' },
  { id: 'technical', label: 'Technical', color: 'bg-indigo-500/10 text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800/60' },
  { id: 'interview', label: 'Interview', color: 'bg-violet-500/10 text-violet-700 border-violet-200 dark:text-violet-400 dark:border-violet-800/60' },
  { id: 'offer', label: 'Offer', color: 'bg-pink-500/10 text-pink-700 border-pink-200 dark:text-pink-400 dark:border-pink-800/60' },
  { id: 'hired', label: 'Hired', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800/60' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800/60' },
];

export default function CandidatesPipeline() {
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getCandidates, updateCandidateStage, deleteCandidate } = useCandidatesApi();
  const { getJobs } = useJobsApi();

  const { data: jobsResponse } = getJobs({ limit: 100 });
  const { data: candidatesResponse, isLoading } = getCandidates({
    jobId: selectedJobId || undefined,
    search: searchQuery || undefined,
    limit: 100,
  });

  const { user } = useAuthStore();

  const jobs = jobsResponse?.data?.jobs || [];
  const candidates = candidatesResponse?.data?.candidates || [];

  const handleStageMove = (candidateId: string, nextStage: string) => {
    updateCandidateStage.mutate({
      id: candidateId,
      stage: nextStage,
      note: `Moved to stage: ${nextStage.replace('-', ' ')}`,
    });
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (confirm('Are you sure you want to remove this candidate profile?')) {
      deleteCandidate.mutate(candidateId);
    }
  };

  // Group candidates by stage
  const candidatesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = candidates.filter((c: any) => c.stage === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  const getNextStage = (currentStage: string): string | null => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
    if (idx !== -1 && idx < PIPELINE_STAGES.length - 1) {
      return PIPELINE_STAGES[idx + 1].id;
    }
    return null;
  };

  const getPrevStage = (currentStage: string): string | null => {
    const idx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);
    if (idx > 0) {
      return PIPELINE_STAGES[idx - 1].id;
    }
    return null;
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Talent Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Track applicants through hiring stages and advance candidates.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Candidate
        </button>
      </div>

      {/* Filter and search utilities */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-card border border-border shrink-0">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search candidate name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        {/* Job opening selection */}
        <div className="w-full sm:w-64">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="">All Job Openings</option>
            {jobs.map((job: any) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board columns wrapper */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-6 px-6">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
            <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading candidate pipeline...
          </div>
        ) : (
          <div className="flex gap-4 h-full min-w-[1200px]">
            {PIPELINE_STAGES.map((stage) => {
              const stageCandidates = candidatesByStage[stage.id] || [];

              return (
                <div
                  key={stage.id}
                  className="w-80 rounded-lg border border-border bg-accent/20 flex flex-col max-h-full overflow-hidden"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-border bg-card flex items-center justify-between shrink-0">
                    <span className="font-bold text-sm text-foreground">{stage.label}</span>
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-accent text-[10px] font-bold text-muted-foreground flex items-center justify-center border border-border">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Column Body Cards scroll list */}
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-0">
                    {stageCandidates.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                        Empty column
                      </div>
                    ) : (
                      stageCandidates.map((candidate) => {
                        const next = getNextStage(candidate.stage);
                        const prev = getPrevStage(candidate.stage);

                        return (
                          <div
                            key={candidate._id}
                            className="p-4 rounded-lg bg-card border border-border hover:border-brand-500/40 hover:shadow-xs transition space-y-3 relative group"
                          >
                            {/* Card text */}
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-foreground leading-tight">
                                {candidate.firstName} {candidate.lastName}
                              </h4>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {candidate.jobId?.title || 'Unknown Opening'}
                              </p>
                              <p className="text-[10px] text-zinc-400 truncate">{candidate.email}</p>
                            </div>

                            {/* Resume & Delete utilities */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground shrink-0">
                              {candidate.resumeUrl ? (
                                <a
                                  href={candidate.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-500 hover:underline"
                                >
                                  Resume <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-[10px] text-zinc-400">No Resume</span>
                              )}

                              <div className="flex items-center gap-1">
                                {(user?.role === 'super_admin' || user?.role === 'admin') && (
                                  <button
                                    onClick={() => handleDeleteCandidate(candidate._id)}
                                    className="p-1 rounded text-red-500 hover:bg-red-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Stage Transition Control Indicators */}
                            <div className="flex items-center justify-between pt-1">
                              {prev ? (
                                <button
                                  onClick={() => handleStageMove(candidate._id, prev)}
                                  className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer"
                                  title={`Move to ${prev.replace('-', ' ')}`}
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </button>
                              ) : (
                                <div className="h-6 w-6" />
                              )}

                              <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-0.5">
                                <ArrowRightLeft className="h-2.5 w-2.5" /> Stage
                              </span>

                              {next ? (
                                <button
                                  onClick={() => handleStageMove(candidate._id, next)}
                                  className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer"
                                  title={`Move to ${next.replace('-', ' ')}`}
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              ) : (
                                <div className="h-6 w-6" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
