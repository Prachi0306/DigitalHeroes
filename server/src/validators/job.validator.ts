import { z } from 'zod';
import { JobType, JobStatus } from '../models/job.model.js';

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    description: z.string().min(10, 'Job description must be at least 10 characters'),
    department: z.string().min(2, 'Department is required'),
    location: z.string().min(2, 'Location is required'),
    type: z.nativeEnum(JobType).optional(),
    status: z.nativeEnum(JobStatus).optional(),
    salaryRange: z
      .object({
        min: z.number().nonnegative().optional(),
        max: z.number().nonnegative().optional(),
        currency: z.string().default('USD'),
      })
      .optional(),
    requirements: z.array(z.string()).optional(),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    department: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    type: z.nativeEnum(JobType).optional(),
    status: z.nativeEnum(JobStatus).optional(),
    salaryRange: z
      .object({
        min: z.number().nonnegative().optional(),
        max: z.number().nonnegative().optional(),
        currency: z.string().optional(),
      })
      .optional(),
    requirements: z.array(z.string()).optional(),
  }),
});
