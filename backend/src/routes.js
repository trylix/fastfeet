import { Router } from 'express';
import multer from 'multer';

import DeliverymanController from './api/controllers/DeliverymanController';
import FileController from './api/controllers/FileController';
import RecipientController from './api/controllers/RecipientController';
import SessionController from './api/controllers/SessionController';
import UserController from './api/controllers/UserController';
import authMiddleware from './api/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
