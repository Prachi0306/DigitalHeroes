export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager',
  INTERVIEWER: 'interviewer',
  VIEWER: 'viewer',
} as const;

export const JOB_STATUS = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  PAUSED: 'Paused',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
} as const;

export const INTERVIEW_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-Show',
} as const;

export const CANDIDATE_SOURCES = [
  'LinkedIn',
  'Referral',
  'Job Board',
  'Direct Application',
  'Agency',
  'Other',
] as const;
