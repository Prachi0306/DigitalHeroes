import { Request, Response } from 'express';
import { Candidate, CandidateStage } from '../models/candidate.model.js';
import { Job } from '../models/job.model.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getPaginationOptions } from '../utils/pagination.js';

export const createCandidate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const { firstName, lastName, email, phone, resumeUrl, jobId, stage } = req.body;

  // Verify the job belongs to this company
  const job = await Job.findOne({ _id: jobId, companyId: req.user.companyId });
  if (!job) {
    throw new ApiError(404, 'Job opening not found or unauthorized');
  }

  const initialStage = stage || CandidateStage.APPLIED;

  const candidate = await Candidate.create({
    firstName,
    lastName,
    email,
    phone,
    resumeUrl,
    jobId,
    stage: initialStage,
    companyId: req.user.companyId,
    createdBy: req.user.id,
    history: [
      {
        stage: initialStage,
        changedAt: new Date(),
        changedBy: req.user.id,
        note: 'Candidate profile added to system',
      },
    ],
  });

  res.status(201).json(new ApiResponse(201, candidate, 'Candidate created successfully'));
});

export const getCandidates = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const { page, limit, skip } = getPaginationOptions(req.query);
  const { jobId, stage, status, search } = req.query;

  const query: any = { companyId: req.user.companyId };

  if (jobId) {
    query.jobId = jobId;
  }
  if (stage) {
    query.stage = stage;
  }
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [candidates, total] = await Promise.all([
    Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('jobId', 'title department location')
      .populate('createdBy', 'firstName lastName email'),
    Candidate.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        candidates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Candidates retrieved successfully'
    )
  );
});

export const getCandidateById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const candidate = await Candidate.findOne({
    _id: req.params.id,
    companyId: req.user.companyId,
  })
    .populate('jobId', 'title department location')
    .populate('history.changedBy', 'firstName lastName email');

  if (!candidate) {
    throw new ApiError(404, 'Candidate not found');
  }

  res.status(200).json(new ApiResponse(200, candidate, 'Candidate retrieved successfully'));
});

export const updateCandidate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const candidate = await Candidate.findOneAndUpdate(
    { _id: req.params.id, companyId: req.user.companyId },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!candidate) {
    throw new ApiError(404, 'Candidate not found or unauthorized to update');
  }

  res.status(200).json(new ApiResponse(200, candidate, 'Candidate updated successfully'));
});

export const updateCandidateStage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const { stage, note } = req.body;

  const candidate = await Candidate.findOne({
    _id: req.params.id,
    companyId: req.user.companyId,
  });

  if (!candidate) {
    throw new ApiError(404, 'Candidate not found or unauthorized');
  }

  if (candidate.stage === stage) {
    return res.status(200).json(new ApiResponse(200, candidate, 'Candidate is already in this stage'));
  }

  // Push to history logs
  candidate.stage = stage;
  candidate.history.push({
    stage,
    changedAt: new Date(),
    changedBy: req.user.id as any,
    note: note || `Stage updated to ${stage.replace('-', ' ')}`,
  });

  await candidate.save();

  res.status(200).json(new ApiResponse(200, candidate, 'Candidate stage updated successfully'));
});

export const deleteCandidate = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const candidate = await Candidate.findOneAndDelete({
    _id: req.params.id,
    companyId: req.user.companyId,
  });

  if (!candidate) {
    throw new ApiError(404, 'Candidate not found or unauthorized to delete');
  }

  res.status(200).json(new ApiResponse(200, null, 'Candidate deleted successfully'));
});
