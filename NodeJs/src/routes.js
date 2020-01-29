import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'Word' });
});

export default routes;
