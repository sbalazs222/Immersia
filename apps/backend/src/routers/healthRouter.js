import { Router } from 'express';
import { HealthControllers } from '../controllers/index.js';

const HealthRouter = Router();

HealthRouter.get('/', HealthControllers.CheckHealth);

export default HealthRouter;
