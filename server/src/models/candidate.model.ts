import mongoose, { Schema, Document } from 'mongoose';

export enum CandidateStage {
  APPLIED = 'applied',
  PHONE_SCREEN = 'phone-screen',
  TECHNICAL = 'technical',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export enum CandidateStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface ICandidateHistory {
  stage: CandidateStage;
  changedAt: Date;
  changedBy: mongoose.Types.ObjectId;
  note?: string;
}

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  jobId: mongoose.Types.ObjectId;
  stage: CandidateStage;
  status: CandidateStatus;
  companyId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  history: ICandidateHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const CandidateHistorySchema = new Schema({
  stage: {
    type: String,
    enum: Object.values(CandidateStage),
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
});

const CandidateSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true,
    },
    stage: {
      type: String,
      enum: Object.values(CandidateStage),
      default: CandidateStage.APPLIED,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CandidateStatus),
      default: CandidateStatus.ACTIVE,
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
    history: [CandidateHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Optimize candidate searches inside a specific company
CandidateSchema.index({ companyId: 1, jobId: 1 });
CandidateSchema.index({ companyId: 1, stage: 1 });
CandidateSchema.index({ companyId: 1, email: 1 });

export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);
