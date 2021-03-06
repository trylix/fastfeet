import { Router } from 'express';
import multer from 'multer';

import CancelDeliveryController from './api/controllers/CancelDeliveryController';
import DeliveriesController from './api/controllers/DeliveriesController';
import DeliverymanController from './api/controllers/DeliverymanController';
import DeliveryProblemController from './api/controllers/DeliveryProblemController';
import FileController from './api/controllers/FileController';
import MerchandiseController from './api/controllers/MerchandiseController';
import RecipientController from './api/controllers/RecipientController';
import SessionController from './api/controllers/SessionController';
import UserController from './api/controllers/UserController';
import authMiddleware from './api/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get(
  '/deliverymans/:deliverymanId/deliveries',
  DeliveriesController.index
);
routes.get(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId',
  DeliveriesController.show
);
routes.post(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId',
  DeliveriesController.store
);
routes.put(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId',
  upload.single('file'),
  DeliveriesController.update
);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);

/*
 * Todas as rotas após o authMiddleware, passará por uma validação da sessão
 */
routes.use(authMiddleware);

routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.show);

routes.delete('/problem/:id/cancel-delivery', CancelDeliveryController.delete);

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

routes.get('/merchandises', MerchandiseController.index);
routes.get('/merchandises/:id', MerchandiseController.show);
routes.post('/merchandises', MerchandiseController.store);
routes.put('/merchandises/:id', MerchandiseController.update);
routes.delete('/merchandises/:id', MerchandiseController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
