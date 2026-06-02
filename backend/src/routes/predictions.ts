import { Router } from 'express';
import { getPredictions } from '../controllers/predictions.controller';

const router = Router();

router.get('/', getPredictions);

export default router;
