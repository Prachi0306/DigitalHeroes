import mongoose, { Schema, Document } from 'mongoose';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface IJob extends Document {
  title: string;
  description: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  companyId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  salaryRange?: {
    min?: number;
    max?: number;
    currency: string;
  };
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(JobType),
      default: JobType.FULL_TIME,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.DRAFT,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID reference is required'],
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator User ID reference is required'],
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for optimizing search / filter within a company
JobSchema.index({ companyId: 1, status: 1 });
JobSchema.index({ companyId: 1, department: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
