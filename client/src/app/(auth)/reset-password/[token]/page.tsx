'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthApi } from '@/hooks/use-auth-api';
import { useParams } from 'next/navigation';

const resetFormSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;
  const { resetPassword } = useAuthApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetFormValues) => {
    resetPassword.mutate({ token, password: data.password });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Reset password</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your new password to regain access to your workspace
        </p>
      </div>

      {resetPassword.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
          {((resetPassword.error as any)?.response?.data?.message) || 'Failed to reset password. The link may have expired.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              errors.password ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="w-full h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetPassword.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving password...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}
