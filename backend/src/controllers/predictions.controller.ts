import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPredictions = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.query;

    const where: any = {};
    if (regionId) {
      if (isNaN(Number(regionId))) {
        res.status(400).json({ error: 'Valid regionId query parameter is required' });
        return;
      }
      where.regionId = Number(regionId);
    }

    const predictions = await prisma.predictionData.findMany({
      where,
      orderBy: { year: 'asc' },
      include: { region: true },
    });

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};
