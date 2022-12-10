import { Router } from 'express';
import Leader from '../controller/leader.controller';

const router = Router();

const leader = new Leader();

router.get('/home', (req, res) => leader.leaderBoardHome(req, res));
router.get('/away', (req, res) => leader.leaderBoardAway(req, res));

export default router;
