import { Request, Response } from 'express';
import { Job } from '../models/job.model.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getPaginationOptions } from '../utils/pagination.js';

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const { title, description, department, location, type, status, salaryRange, requirements } = req.body;

  const job = await Job.create({
    title,
    description,
    department,
    location,
    type,
    status,
    salaryRange,
    requirements,
    companyId: req.user.companyId,
    createdBy: req.user.id,
  });

  res.status(201).json(new ApiResponse(201, job, 'Job opening created successfully'));
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const { page, limit, skip } = getPaginationOptions(req.query);
  const { status, department, search } = req.query;

  // Filter by companyId
  const query: any = { companyId: req.user.companyId };

  if (status) {
    query.status = status;
  }
  if (department) {
    query.department = department;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName email'),
    Job.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Job openings retrieved successfully'
    )
  );
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const job = await Job.findOne({
    _id: req.params.id,
    companyId: req.user.companyId,
  }).populate('createdBy', 'firstName lastName email');

  if (!job) {
    throw new ApiError(404, 'Job opening not found');
  }

  res.status(200).json(new ApiResponse(200, job, 'Job opening retrieved successfully'));
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, companyId: req.user.companyId },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new ApiError(404, 'Job opening not found or unauthorized to update');
  }

  res.status(200).json(new ApiResponse(200, job, 'Job opening updated successfully'));
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user.companyId) {
    throw new ApiError(401, 'Unauthorized or missing company context');
  }

  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    companyId: req.user.companyId,
  });

  if (!job) {
    throw new ApiError(404, 'Job opening not found or unauthorized to delete');
  }

  res.status(200).json(new ApiResponse(200, null, 'Job opening deleted successfully'));
});
