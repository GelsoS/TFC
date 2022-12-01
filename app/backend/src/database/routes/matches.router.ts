import { Router } from 'express';
import MatchesController from '../controller/matches.controller';

const router = Router();
const matchesController = new MatchesController();

router.get('/', (req, res) => matchesController.get(req, res));
router.post('/', (req, res) => matchesController.salved(req, res));
router.patch('/:id/finish', (req, res) => matchesController.finishMatch(req, res));

export default router;
