import { Router } from 'express';
import * as candidateController from '../controllers/candidate.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { UserRole } from '../models/user.model.js';
import {
  createCandidateSchema,
  updateCandidateSchema,
  updateCandidateStageSchema,
} from '../validators/candidate.validator.js';

const router = Router();

// Protect all routes under candidates
router.use(protect);

router.post(
  '/',
  validate(createCandidateSchema),
  candidateController.createCandidate
);

router.get('/', candidateController.getCandidates);

router.get('/:id', candidateController.getCandidateById);

router.patch(
  '/:id',
  validate(updateCandidateSchema),
  candidateController.updateCandidate
);

router.patch(
  '/:id/stage',
  validate(updateCandidateStageSchema),
  candidateController.updateCandidateStage
);

router.delete(
  '/:id',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  candidateController.deleteCandidate
);

export default router;
