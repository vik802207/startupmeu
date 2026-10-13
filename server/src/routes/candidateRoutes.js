import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  updateCandidateStage,
  addCandidateNote,
  updateCandidateScorecard,
  deleteCandidate,
} from '../controllers/candidateController.js';

const router = express.Router();

router.route('/').get(getCandidates).post(createCandidate);

router.route('/:id').get(getCandidateById).put(updateCandidate).delete(deleteCandidate);

router.patch('/:id/stage', updateCandidateStage);
router.post('/:id/notes', addCandidateNote);
router.put('/:id/scorecard', updateCandidateScorecard);

export default router;
