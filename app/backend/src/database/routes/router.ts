import { Router } from 'express';

import loginRouter from './login.router';

const routers = Router();

routers.use('/login', loginRouter);

export default routers;
