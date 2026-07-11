import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logoUrl?: string;
  domain: string;
  industry?: string;
  website?: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    defaultPipelineStages: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    settings: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      defaultPipelineStages: {
        type: [String],
        default: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanySchema.index({ domain: 1 }, { unique: true });

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
