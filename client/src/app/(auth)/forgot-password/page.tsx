'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthApi } from '@/hooks/use-auth-api';

const forgotFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotFormSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthApi();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We sent a password reset link to your email address. Please follow the instructions to reset your password.
          </p>
        </div>
        <div className="text-center text-sm mt-6">
          <Link href="/login" className="text-brand-500 font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your registered email address and we will send you a recovery link
        </p>
      </div>

      {forgotPassword.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
          {((forgotPassword.error as any)?.response?.data?.message) || 'Something went wrong. Please check your email and try again.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              errors.email ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPassword.isPending}
          className="w-full h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {forgotPassword.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending link...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
        Remembered your password?{' '}
        <Link href="/login" className="text-brand-500 font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
