import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Shape of each cause item returned to the frontend */
interface CauseItem {
  title: string;
  description: string;
  impactScore: number;
}

/** Grouped response shape */
interface CausesResponse {
  local: CauseItem[];
  seasonal: CauseItem[];
  global: CauseItem[];
}

export const getCausesByRegion = async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;

    if (!regionId || isNaN(Number(regionId))) {
      res.status(400).json({ error: 'Valid regionId is required' });
      return;
    }

    // Verify the region exists
    const region = await prisma.region.findUnique({
      where: { regionId: Number(regionId) },
    });

    if (!region) {
      res.status(404).json({ error: 'Region not found' });
      return;
    }

    const causes = await prisma.environmentalCause.findMany({
      where: { regionId: Number(regionId) },
      orderBy: { impactScore: 'desc' },
    });

    // Group by factorType
    const grouped: CausesResponse = {
      local: [],
      seasonal: [],
      global: [],
    };

    for (const cause of causes) {
      const item: CauseItem = {
        title: cause.title,
        description: cause.description,
        impactScore: cause.impactScore,
      };

      if (cause.factorType === 'local') grouped.local.push(item);
      else if (cause.factorType === 'seasonal') grouped.seasonal.push(item);
      else if (cause.factorType === 'global') grouped.global.push(item);
    }

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching causes:', error);
    res.status(500).json({ error: 'Failed to fetch environmental causes' });
  }
};
