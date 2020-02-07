import { Router } from 'express';

import SessionController from './api/controllers/SessionController';
import UserController from './api/controllers/UserController';
import authMiddleware from './api/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

/*
 * Todas as rotas após o authMiddleware, passará por uma validação da sessão
 */
routes.use(authMiddleware);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

export default routes;
