import { Router } from 'express';
import * as jobController from '../controllers/job.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { UserRole } from '../models/user.model.js';
import { createJobSchema, updateJobSchema } from '../validators/job.validator.js';

const router = Router();

// Protect all routes under jobs
router.use(protect);

router.post(
  '/',
  validate(createJobSchema),
  jobController.createJob
);

router.get('/', jobController.getJobs);

router.get('/:id', jobController.getJobById);

router.patch(
  '/:id',
  validate(updateJobSchema),
  jobController.updateJob
);

router.delete(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  jobController.deleteJob
);

export default router;
