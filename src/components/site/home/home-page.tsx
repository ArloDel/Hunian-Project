import type { CatalogUnit } from "@/lib/catalog";
import { getCatalogPreview } from "@/lib/catalog";
import { HomeBookingSection } from "@/components/site/home/home-booking-section";
import { HomeCatalogSection } from "@/components/site/home/home-catalog-section";
import { HomeHeroSection } from "@/components/site/home/home-hero-section";
import { HomeOwnerSection } from "@/components/site/home/home-owner-section";
import { SiteFooter } from "@/components/site/shared/site-footer";

export function HomePage({ units }: { units: CatalogUnit[] }) {
  const featuredUnits = getCatalogPreview(units);
  const featuredUnit = featuredUnits[0];

  return (
    <main className="relative overflow-hidden">
      <HomeHeroSection featuredUnit={featuredUnit} unitCount={units.length} />
      <HomeCatalogSection units={featuredUnits} />
      <HomeBookingSection featuredUnit={featuredUnit} />
      <HomeOwnerSection />
      <SiteFooter />
    </main>
  );
}
