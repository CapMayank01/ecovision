import { Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const ML_SUPPORTED_CITIES = [
  "Baghpat",
  "Ghaziabad",
  "Hapur",
  "Khekra",
  "Mawana",
  "Meerut",
  "Modinagar",
  "Muradnagar",
  "Pilkhuwa",
  "Sardhana"
];

const CITY_FALLBACK_MAP: Record<string, string> = {
  "Delhi NCR": "Ghaziabad",
  "Noida": "Ghaziabad",
  "Muzaffarnagar": "Meerut",
  "Haridwar": "Meerut",
  "Hastinapur": "Mawana",
  "Kithor": "Meerut",
  "Daurala": "Meerut",
  "Parikshitgarh": "Meerut",
  "Modipuram": "Meerut"
};

function getMLCityName(dbName: string): string {
  const match = ML_SUPPORTED_CITIES.find(c => c.toLowerCase() === dbName.toLowerCase());
  if (match) return match;
  return CITY_FALLBACK_MAP[dbName] || "Meerut";
}

async function buildPayload(regionId: number, landType: string, year: number) {
  const region = await prisma.region.findUnique({
    where: { regionId },
  });
  if (!region) throw new Error(`Region ${regionId} not found`);

  const city = getMLCityName(region.name);
  const env = await prisma.landMarketData.findFirst({
    where: { regionId }, orderBy: { year: "desc" },
  });
  return {
    city, land_type: landType, year,
    ...(env && {
      aqi:                 env.aqi,
      green_cover_percent: env.greenCoverPercent,
      water_quality_index: env.waterQualityIndex,
      flood_risk_score:    env.floodRiskScore ? env.floodRiskScore / 100 : null,
    }),
  };
}

export const getForecast = async (req: Request, res: Response) => {
  try {
    const regionId = Number(req.params.regionId);
    const landType = (req.query.landType as string) || "Residential";
    const year     = Number(req.query.year) || new Date().getFullYear();
    const payload  = await buildPayload(regionId, landType, year);
    const { data } = await axios.post(`${ML_URL}/predict/forecast`, payload);
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: "ML forecast failed", detail: err.message });
  }
};

export const getAllTypePrices = async (req: Request, res: Response) => {
  try {
    const regionId = Number(req.params.regionId);
    const year     = Number(req.query.year) || new Date().getFullYear();
    
    const region = await prisma.region.findUnique({
      where: { regionId },
    });
    if (!region) return res.status(404).json({ error: "Region not found" });

    const city = getMLCityName(region.name);
    const { data } = await axios.post(`${ML_URL}/predict/all-types`, { city, year });
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: "ML all-types failed", detail: err.message });
  }
};
