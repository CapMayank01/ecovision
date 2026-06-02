import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRegions = async (_req: Request, res: Response) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        historicalData: { orderBy: { year: 'asc' } },
      },
    });
    res.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
};

export const getRegionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ error: 'Valid region ID is required' });
      return;
    }

    const region = await prisma.region.findUnique({
      where: { regionId: Number(id) },
      include: {
        historicalData: { orderBy: { year: 'asc' } },
        predictionData: { orderBy: { year: 'asc' } },
        regionSolutions: {
          include: { solution: true },
        },
      },
    });

    if (!region) {
      res.status(404).json({ error: 'Region not found' });
      return;
    }

    res.json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({ error: 'Failed to fetch region' });
  }
};
