'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCandidatesApi } from '@/hooks/use-candidates-api';
import { useJobsApi } from '@/hooks/use-jobs-api';

const candidateFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  resumeUrl: z.string().url('Please enter a valid URL (e.g. Google Drive/Dropbox Link)').optional().or(z.literal('')),
  jobId: z.string().min(1, 'Please select a job opening'),
  stage: z.enum(['applied', 'phone-screen', 'technical', 'interview', 'offer', 'rejected', 'hired']),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
  const { createCandidate } = useCandidatesApi();
  const { getJobs } = useJobsApi();
  const { data: jobsData, isLoading: isLoadingJobs } = getJobs({ limit: 100 });

  const activeJobs = jobsData?.data?.jobs || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      jobId: '',
      stage: 'applied',
    },
  });

  const onSubmit = (values: CandidateFormValues) => {
    createCandidate.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Add Candidate</h3>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-accent rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">First Name</label>
                  <input
                    placeholder="Jane"
                    {...register('firstName')}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      errors.firstName ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                  <input
                    placeholder="Doe"
                    {...register('lastName')}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      errors.lastName ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  placeholder="jane.doe@example.com"
                  {...register('email')}
                  className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Phone Number (optional)</label>
                <input
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Resume URL (optional)</label>
                <input
                  placeholder="https://drive.google.com/..."
                  {...register('resumeUrl')}
                  className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.resumeUrl ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.resumeUrl && <p className="text-xs text-red-500">{errors.resumeUrl.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Job Opening</label>
                <select
                  {...register('jobId')}
                  className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.jobId ? 'border-red-500' : 'border-border'
                  }`}
                >
                  <option value="">Select an active job</option>
                  {activeJobs.map((job: any) => (
                    <option key={job._id} value={job._id}>
                      {job.title} ({job.department})
                    </option>
                  ))}
                </select>
                {isLoadingJobs && <p className="text-xs text-muted-foreground">Loading job options...</p>}
                {errors.jobId && <p className="text-xs text-red-500">{errors.jobId.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Initial Pipeline Stage</label>
                <select
                  {...register('stage')}
                  className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="applied">Applied</option>
                  <option value="phone-screen">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 h-10 rounded-md border border-border text-sm font-medium hover:bg-accent transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCandidate.isPending}
                  className="px-5 h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
                >
                  {createCandidate.isPending ? 'Adding...' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
