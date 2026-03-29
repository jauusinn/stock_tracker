"use server";

import { SectorScanner } from "@/utils/SectorScanner";

export async function fetchTopPerformers(sectorTicker: string) {
  return await SectorScanner.getTopSectorPerformers(sectorTicker);
}
