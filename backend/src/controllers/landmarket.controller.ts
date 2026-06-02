import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/land-market/:regionId
 * Returns historical land price + environmental data for a region.
 */
export const getLandMarketData = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;
    if (!regionId || isNaN(Number(regionId))) {
      res.status(400).json({ error: 'Valid region ID is required' });
      return;
    }

    const region = await prisma.region.findUnique({
      where: { regionId: Number(regionId) },
    });

    if (!region) {
      res.status(404).json({ error: 'Region not found' });
      return;
    }

    const marketData = await prisma.landMarketData.findMany({
      where: { regionId: Number(regionId) },
      orderBy: { year: 'asc' },
    });

    res.json({ region, marketData });
  } catch (error) {
    console.error('Error fetching land market data:', error);
    res.status(500).json({ error: 'Failed to fetch land market data' });
  }
};

/**
 * GET /api/land-market/:regionId/predictions
 * Returns future price predictions for a region.
 */
export const getLandPricePredictions = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;
    if (!regionId || isNaN(Number(regionId))) {
      res.status(400).json({ error: 'Valid region ID is required' });
      return;
    }

    const predictions = await prisma.landPricePrediction.findMany({
      where: { regionId: Number(regionId) },
      orderBy: { year: 'asc' },
      include: { region: true },
    });

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching land price predictions:', error);
    res.status(500).json({ error: 'Failed to fetch land price predictions' });
  }
};

/**
 * GET /api/land-market/compare
 * Compare land values across all urban (Meerut-area) cities.
 * Returns the latest year of market data + predictions per city.
 */
export const compareLandMarket = async (_req: Request, res: Response) => {
  try {
    const urbanRegions = await prisma.region.findMany({
      where: { type: 'urban' },
      include: {
        landMarketData: { orderBy: { year: 'asc' } },
        landPricePredictions: { orderBy: { year: 'asc' } },
      },
    });

    const comparison = urbanRegions.map((r) => {
      const latest = r.landMarketData[r.landMarketData.length - 1];
      const latestPred = r.landPricePredictions[r.landPricePredictions.length - 1];
      return {
        regionId: r.regionId,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        currentPrice: latest?.avgPricePerSqft ?? null,
        currentYear: latest?.year ?? null,
        aqi: latest?.aqi ?? null,
        greenCoverPercent: latest?.greenCoverPercent ?? null,
        waterQualityIndex: latest?.waterQualityIndex ?? null,
        floodRiskScore: latest?.floodRiskScore ?? null,
        predictedPrice2035: latestPred?.predictedPricePerSqft ?? null,
        environmentalScore: latestPred?.environmentalScore ?? null,
        historicalPrices: r.landMarketData.map((d) => ({ year: d.year, price: d.avgPricePerSqft })),
        predictions: r.landPricePredictions.map((p) => ({ year: p.year, price: p.predictedPricePerSqft, envScore: p.environmentalScore })),
      };
    });

    res.json(comparison);
  } catch (error) {
    console.error('Error comparing land market data:', error);
    res.status(500).json({ error: 'Failed to compare land market data' });
  }
};

// Price-increasing vs price-decreasing factor keywords
const PRICE_UP_KEYWORDS = ['expressway', 'connectivity', 'tourism', 'heritage', 'pilgrimage', 'campus', 'university', 'rental', 'planned', 'icar', 'spillover', 'demand', 'suburb', 'affordable', 'employment', 'gateway', 'acquisition', 'sanctuary', 'premium'];
const PRICE_DOWN_KEYWORDS = ['pollution', 'contamination', 'flood', 'depletion', 'smog', 'effluent', 'waterlogging', 'burning', 'bagasse', 'poor road', 'limited', 'heat', 'loss of', 'risk'];

/**
 * GET /api/land-market/:regionId/analysis
 * Returns environmental causes for a region with price-impact direction.
 */
export const getCityAnalysis = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;
    if (!regionId || isNaN(Number(regionId))) {
      res.status(400).json({ error: 'Valid region ID is required' });
      return;
    }

    const region = await prisma.region.findUnique({
      where: { regionId: Number(regionId) },
    });
    if (!region) { res.status(404).json({ error: 'Region not found' }); return; }

    const causes = await prisma.environmentalCause.findMany({
      where: { regionId: Number(regionId) },
      orderBy: { impactScore: 'desc' },
    });

    const latest = await prisma.landMarketData.findFirst({
      where: { regionId: Number(regionId) },
      orderBy: { year: 'desc' },
    });

    const latestPred = await prisma.landPricePrediction.findFirst({
      where: { regionId: Number(regionId) },
      orderBy: { year: 'desc' },
    });

    const factors = causes.map((c) => {
      const lower = (c.title + ' ' + c.description).toLowerCase();
      const isUp = PRICE_UP_KEYWORDS.some((k) => lower.includes(k));
      const isDown = PRICE_DOWN_KEYWORDS.some((k) => lower.includes(k));
      const direction: 'up' | 'down' | 'neutral' = isUp && !isDown ? 'up' : isDown && !isUp ? 'down' : isUp && isDown ? (c.impactScore > 60 ? 'down' : 'up') : 'neutral';
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        factorType: c.factorType,
        impactScore: c.impactScore,
        priceDirection: direction,
      };
    });

    const upFactors = factors.filter((f) => f.priceDirection === 'up');
    const downFactors = factors.filter((f) => f.priceDirection === 'down');
    const avgUpImpact = upFactors.length ? upFactors.reduce((s, f) => s + f.impactScore, 0) / upFactors.length : 0;
    const avgDownImpact = downFactors.length ? downFactors.reduce((s, f) => s + f.impactScore, 0) / downFactors.length : 0;

    res.json({
      region: { regionId: region.regionId, name: region.name, description: region.description },
      factors,
      summary: {
        totalFactors: factors.length,
        priceUpFactors: upFactors.length,
        priceDownFactors: downFactors.length,
        avgUpImpact: Math.round(avgUpImpact),
        avgDownImpact: Math.round(avgDownImpact),
        netDirection: avgUpImpact > avgDownImpact ? 'up' : 'down',
        currentPrice: latest?.avgPricePerSqft ?? null,
        predictedPrice: latestPred?.predictedPricePerSqft ?? null,
        environmentalScore: latestPred?.environmentalScore ?? null,
      },
    });
  } catch (error) {
    console.error('Error fetching city analysis:', error);
    res.status(500).json({ error: 'Failed to fetch city analysis' });
  }
};
