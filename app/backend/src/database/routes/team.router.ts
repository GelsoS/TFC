import { Router } from 'express';
import TeamController from '../controller/team.controller';

const router = Router();
const teamController = new TeamController();

router.get('/', (req, res) => teamController.getTeam(req, res));
router.get('/:id', (req, res) => teamController.getId(req, res));

export default router;
