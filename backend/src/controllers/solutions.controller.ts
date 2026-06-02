import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSolutions = async (_req: Request, res: Response) => {
  try {
    const solutions = await prisma.solution.findMany({
      include: {
        regionSolutions: {
          include: { region: true },
        },
      },
    });
    res.json(solutions);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ error: 'Failed to fetch solutions' });
  }
};
