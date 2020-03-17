import { Router } from 'express';
import multer from 'multer';
import configMulter from './config/multer';

// controller
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

// middleware
import authMiddleware from './app/middlewares/auth';
import ScheduleController from './app/controllers/ScheduleController';

const routes = new Router();
const upload = multer(configMulter);

routes.get('/', (req, res) => res.json({ online: true }));

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
