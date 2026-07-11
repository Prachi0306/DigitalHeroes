'use client';

import React, { useState } from 'react';
import { useJobsApi, JobFilterParams } from '@/hooks/use-jobs-api';
import CreateJobModal from '@/components/jobs/create-job-modal';
import { Plus, Search, Edit2, Trash2, Filter, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    department: '',
    status: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<any>(null);

  const { getJobs, deleteJob } = useJobsApi();
  const { data, isLoading } = getJobs(filters);
  const { user } = useAuthStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, department: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleEditClick = (job: any) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setJobToEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this job opening? This action cannot be undone.')) {
      deleteJob.mutate(id);
    }
  };

  const jobsList = data?.data?.jobs || [];
  const pagination = data?.data?.pagination || { page: 1, pages: 1 };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Job Openings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your company&apos;s open positions, departments, and pipelines
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Opening
        </button>
      </div>

      {/* Filter and search utilities */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-card border border-border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search job title or department..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden lg:block" />
          <select
            value={filters.department}
            onChange={handleDeptChange}
            className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs table list container */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground text-sm">
            <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading job openings...
          </div>
        ) : jobsList.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
            <Briefcase className="h-8 w-8 mx-auto text-zinc-400" />
            <p className="font-medium text-foreground">No openings found</p>
            <p>Try refining your filters or create a new job opening to begin</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/40 font-semibold text-muted-foreground">
                  <th className="p-4">Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobsList.map((job: any) => (
                  <tr key={job._id} className="hover:bg-accent/20 transition">
                    <td className="p-4 font-bold text-foreground">{job.title}</td>
                    <td className="p-4 text-muted-foreground">{job.department}</td>
                    <td className="p-4 text-muted-foreground">{job.location}</td>
                    <td className="p-4 capitalize text-muted-foreground">{job.type.replace('-', ' ')}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
                          job.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : job.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleEditClick(job)}
                          className="h-8 w-8 rounded bg-accent hover:bg-brand-500 hover:text-white flex items-center justify-center transition text-muted-foreground cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {(user?.role === 'super_admin' || user?.role === 'admin') && (
                          <button
                            onClick={() => handleDeleteClick(job._id)}
                            className="h-8 w-8 rounded bg-accent hover:bg-red-500 hover:text-white flex items-center justify-center transition text-muted-foreground cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
            className="px-3 h-9 rounded border border-border text-sm font-medium hover:bg-accent disabled:opacity-50 transition cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Page {filters.page} of {pagination.pages}
          </span>
          <button
            disabled={filters.page === pagination.pages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            className="px-3 h-9 rounded border border-border text-sm font-medium hover:bg-accent disabled:opacity-50 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Popup */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobToEdit={jobToEdit}
      />
    </div>
  );
}
