import { Router } from 'express';
import { getCausesByRegion } from '../controllers/causes.controller';

const router = Router();

router.get('/:regionId', getCausesByRegion);

export default router;
