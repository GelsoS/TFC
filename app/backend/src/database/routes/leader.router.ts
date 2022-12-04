import { Router } from 'express';
import Leader from '../controller/leader.controller';

const router = Router();

const leader = new Leader();

router.get('/home', (req, res) => leader.leaderBoard(req, res));

export default router;
