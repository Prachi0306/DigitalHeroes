export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'viewer';
  companyId?: string;
  avatarUrl?: string;
}
