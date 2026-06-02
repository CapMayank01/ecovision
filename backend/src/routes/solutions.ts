import { Router } from 'express';
import { getSolutions } from '../controllers/solutions.controller';

const router = Router();

router.get('/', getSolutions);

export default router;
