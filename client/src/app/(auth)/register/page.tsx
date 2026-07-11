'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthApi } from '@/hooks/use-auth-api';

const registerFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  domain: z.string().min(3, 'Domain must be a valid identifier (e.g. mycompany)'),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: registerMutation } = useAuthApi();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      companyName: '',
      domain: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Create your workspace</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Get started with HireTrack to manage pipelines and candidates
        </p>
      </div>

      {registerMutation.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500">
          {((registerMutation.error as any)?.response?.data?.message) || 'Failed to create workspace. Try another email or domain.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              First Name
            </label>
            <input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
              className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.firstName ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
              }`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Last Name
            </label>
            <input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
              className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.lastName ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
              }`}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Work Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@mycompany.com"
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
          <label htmlFor="password" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Password (min 8 chars)
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

        <hr className="border-zinc-200 dark:border-zinc-800 my-4" />

        <div className="space-y-1">
          <label htmlFor="companyName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Company Name
          </label>
          <input
            id="companyName"
            placeholder="Acme Corp"
            {...register('companyName')}
            className={`w-full h-10 px-3 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
              errors.companyName ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
            }`}
          />
          {errors.companyName && (
            <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="domain" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Workspace Domain
          </label>
          <div className="relative flex items-center">
            <input
              id="domain"
              placeholder="acme"
              {...register('domain')}
              className={`w-full h-10 pl-3 pr-32 rounded-md border text-sm bg-card transition focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.domain ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-800'
              }`}
            />
            <span className="absolute right-3 text-xs font-medium text-zinc-400 select-none">
              .hiretrack.com
            </span>
          </div>
          {errors.domain && (
            <p className="text-xs text-red-500 mt-1">{errors.domain.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-10 rounded-md bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm flex items-center justify-center transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating workspace...
            </span>
          ) : (
            'Create Workspace'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
        Already have a workspace?{' '}
        <Link href="/login" className="text-brand-500 font-semibold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
