import type { CatalogAvailability, CatalogUnit } from "@/lib/catalog";
import { CatalogPageGrid } from "@/components/site/catalog/catalog-page-grid";
import { CatalogPageHero } from "@/components/site/catalog/catalog-page-hero";
import { SiteHeader } from "@/components/site/shared/site-header";

type CatalogPageProps = {
  units: CatalogUnit[];
  availability: CatalogAvailability;
  type: "all" | "kost" | "kontrakan";
};

export function CatalogPage({ units, availability, type }: CatalogPageProps) {
  return (
    <main className="relative overflow-hidden">
      <section className="hero-grid relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <SiteHeader />
          <CatalogPageHero availability={availability} type={type} total={units.length} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <CatalogPageGrid units={units} />
      </section>
    </main>
  );
}
