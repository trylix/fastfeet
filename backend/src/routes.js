import { Router } from 'express';

import RecipientController from './api/controllers/RecipientController';
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

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

export default routes;
