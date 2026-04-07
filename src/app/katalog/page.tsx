import { CatalogPage } from "@/components/site/catalog-page";
import {
  getCatalogUnits,
  type CatalogAvailability,
} from "@/lib/catalog";

function parseAvailability(value?: string): CatalogAvailability {
  if (value === "available" || value === "full") {
    return value;
  }

  return "all";
}

function parseType(value?: string) {
  if (value === "kost" || value === "kontrakan") {
    return value;
  }

  return "all";
}

export default async function Katalog({
  searchParams,
}: {
  searchParams: Promise<{ availability?: string; type?: string }>;
}) {
  const params = await searchParams;
  const availability = parseAvailability(params.availability);
  const type = parseType(params.type);
  const units = await getCatalogUnits({ availability, type });

  return <CatalogPage units={units} availability={availability} type={type} />;
}
