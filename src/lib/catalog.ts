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

export const catalogPlaceholderImages = [
  "/placeholder-unit-1.svg",
  "/placeholder-unit-2.svg",
  "/placeholder-unit-3.svg",
] as const;

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

export function formatCatalogPrice(value: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function getCatalogUnitTypeLabel(type: CatalogUnit["type"]) {
  return type === "kost" ? "Kost" : "Kontrakan";
}

export function getCatalogAvailabilityLabel(unit: CatalogUnit) {
  if (unit.availableRooms > 1) {
    return `${unit.availableRooms} unit tersedia`;
  }

  if (unit.availableRooms === 1) {
    return "Tersisa 1 unit";
  }

  return "Sedang penuh";
}

export function getHomeAvailabilityLabel(unit: CatalogUnit) {
  if (unit.availableRooms > 1) {
    return `Tersedia ${unit.availableRooms} unit`;
  }

  if (unit.availableRooms === 1) {
    return "Tersisa 1 unit";
  }

  return "Sedang penuh";
}

export function getCatalogPreview(units: CatalogUnit[], limit = 3) {
  return units.slice(0, limit);
}

export function getCatalogGalleryImages(imageUrls: string[]) {
  return imageUrls.length ? imageUrls : [...catalogPlaceholderImages];
}
