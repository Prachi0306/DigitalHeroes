'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useJobsApi } from '@/hooks/use-jobs-api';

const jobFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  status: z.enum(['draft', 'active', 'closed']),
  minSalary: z.number().min(0, 'Must be positive or zero'),
  maxSalary: z.number().min(0, 'Must be positive or zero'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirementsText: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: any;
}

export default function CreateJobModal({ isOpen, onClose, jobToEdit }: CreateJobModalProps) {
  const { createJob, updateJob } = useJobsApi();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    values: jobToEdit
      ? {
          title: jobToEdit.title,
          department: jobToEdit.department,
          location: jobToEdit.location,
          type: jobToEdit.type,
          status: jobToEdit.status,
          minSalary: jobToEdit.salaryRange?.min || 0,
          maxSalary: jobToEdit.salaryRange?.max || 0,
          description: jobToEdit.description,
          requirementsText: jobToEdit.requirements?.join(', ') || '',
        }
      : {
          title: '',
          department: 'Engineering',
          location: 'Remote',
          type: 'full-time',
          status: 'draft',
          minSalary: 0,
          maxSalary: 0,
          description: '',
          requirementsText: '',
        },
  });

  const onSubmit = (values: JobFormValues) => {
    const payload = {
      title: values.title,
      department: values.department,
      location: values.location,
      type: values.type,
      status: values.status,
      description: values.description,
      salaryRange: {
        min: values.minSalary,
        max: values.maxSalary,
        currency: 'USD',
      },
      requirements: values.requirementsText
        ? values.requirementsText
            .split(',')
            .map((req) => req.trim())
            .filter((req) => req.length > 0)
        : [],
    };

    if (jobToEdit) {
      updateJob.mutate(
        { id: jobToEdit._id, data: payload },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    } else {
      createJob.mutate(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  const isPending = createJob.isPending || updateJob.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header title */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {jobToEdit ? 'Edit Job Opening' : 'Create New Job Opening'}
              </h3>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-accent rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable form view */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
                <input
                  placeholder="e.g. Senior Frontend Engineer"
                  {...register('title')}
                  className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                    errors.title ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Department</label>
                  <select
                    {...register('department')}
                    className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Location</label>
                  <input
                    placeholder="e.g. Remote / New York"
                    {...register('location')}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      errors.location ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Employment Type</label>
                  <select
                    {...register('type')}
                    className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Publishing Status</label>
                  <select
                    {...register('status')}
                    className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Min Salary ($ / year)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80000"
                    {...register('minSalary', { valueAsNumber: true })}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      errors.minSalary ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.minSalary && <p className="text-xs text-red-500">{errors.minSalary.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Max Salary ($ / year)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120000"
                    {...register('maxSalary', { valueAsNumber: true })}
                    className={`w-full h-10 px-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                      errors.maxSalary ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.maxSalary && <p className="text-xs text-red-500">{errors.maxSalary.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Job Description</label>
                <textarea
                  rows={4}
                  placeholder="Summarize the role objectives and daily duties..."
                  {...register('description')}
                  className={`w-full p-3 rounded-md border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Requirements (comma-separated list)</label>
                <input
                  placeholder="e.g. React, TypeScript, 5+ years experience"
                  {...register('requirementsText')}
                  className="w-full h-10 px-3 rounded-md border border-border text-sm bg-background transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Action Buttons */}
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
                  disabled={isPending}
                  className="px-5 h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Saving...' : jobToEdit ? 'Save Changes' : 'Create Job'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
