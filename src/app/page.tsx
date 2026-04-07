import { HomePage } from "@/components/site/home-page";
import { getCatalogUnits } from "@/lib/catalog";

export default async function Home() {
  const units = await getCatalogUnits();

  return <HomePage units={units} />;
}
