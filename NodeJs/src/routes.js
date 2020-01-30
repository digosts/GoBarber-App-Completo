import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/user', UserController.store);

export default routes;
