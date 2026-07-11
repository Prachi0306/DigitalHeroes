import { z } from 'zod';
import { CandidateStage, CandidateStatus } from '../models/candidate.model.js';

export const createCandidateSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    resumeUrl: z.string().url('Please enter a valid resume URL').optional().or(z.literal('')),
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Job ID format'),
    stage: z.nativeEnum(CandidateStage).optional(),
    status: z.nativeEnum(CandidateStatus).optional(),
  }),
});

export const updateCandidateSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    resumeUrl: z.string().url().optional().or(z.literal('')),
    jobId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    stage: z.nativeEnum(CandidateStage).optional(),
    status: z.nativeEnum(CandidateStatus).optional(),
  }),
});

export const updateCandidateStageSchema = z.object({
  body: z.object({
    stage: z.nativeEnum(CandidateStage),
    note: z.string().optional(),
  }),
});
