'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthApi } from '@/hooks/use-auth-api';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login } = useAuthApi();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your credentials to access your recruiting account
        </p>
      </div>

      {login.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
          {((login.error as any)?.response?.data?.message) || 'Invalid email or password.'}
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

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {login.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
        Don&apos;t have an workspace?{' '}
        <Link href="/register" className="text-brand-500 font-semibold hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
