import { Router } from 'express';
import { getLandMarketData, getLandPricePredictions, compareLandMarket, getCityAnalysis } from '../controllers/landmarket.controller';

const router = Router();

router.get('/compare', compareLandMarket);
router.get('/:regionId/analysis', getCityAnalysis);
router.get('/:regionId', getLandMarketData);
router.get('/:regionId/predictions', getLandPricePredictions);

export default router;
