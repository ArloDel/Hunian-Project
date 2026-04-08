import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { units, type UnitType } from "@/db/schema";
import { parseJsonList } from "@/lib/api";

export type CatalogAvailability = "all" | "available" | "full";

export type CatalogUnit = {
  id: string;
  name: string;
  slug: string;
  type: UnitType;
  location: string;
  address: string | null;
  description: string | null;
  price: string;
  stock: number;
  availableRooms: number;
  facilities: string[];
  imageUrls: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type CatalogOptions = {
  type?: UnitType | "all";
  availability?: CatalogAvailability;
};

function mapCatalogUnit(unit: typeof units.$inferSelect): CatalogUnit {
  return {
    ...unit,
    facilities: parseJsonList(unit.facilities),
    imageUrls: parseJsonList(unit.imageUrls),
  };
}

export async function getCatalogUnits(options: CatalogOptions = {}) {
  const filters = [
    eq(units.isPublished, true),
    options.type && options.type !== "all" ? eq(units.type, options.type) : undefined,
  ].filter(Boolean);

  const records = await db
    .select()
    .from(units)
    .where(and(...filters))
    .orderBy(asc(units.availableRooms), asc(units.price), asc(units.name));

  const mapped = records.map(mapCatalogUnit);

  if (options.availability === "available") {
    return mapped.filter((unit) => unit.availableRooms > 0);
  }

  if (options.availability === "full") {
    return mapped.filter((unit) => unit.availableRooms < 1);
  }

  return mapped;
}

export async function getCatalogUnitBySlug(slug: string) {
  const [record] = await db
    .select()
    .from(units)
    .where(and(eq(units.slug, slug), eq(units.isPublished, true)))
    .limit(1);

  if (!record) {
    return null;
  }

  return mapCatalogUnit(record);
}
