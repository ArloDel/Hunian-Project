import { HomePage } from "@/components/site/home/home-page";
import { getCatalogUnits } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const units = await getCatalogUnits();

  return <HomePage units={units} />;
}
