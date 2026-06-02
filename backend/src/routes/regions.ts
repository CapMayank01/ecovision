import { Router } from 'express';
import { getRegions, getRegionById } from '../controllers/regions.controller';

const router = Router();

router.get('/', getRegions);
router.get('/:id', getRegionById);

export default router;
