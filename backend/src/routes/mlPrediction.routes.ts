import { Router } from "express";
import { getForecast, getAllTypePrices } from "../controllers/mlPrediction.controller";
const router = Router();
router.get("/:regionId/forecast",  getForecast);
router.get("/:regionId/all-types", getAllTypePrices);
export default router;
