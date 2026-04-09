import type { CatalogUnit } from "@/lib/catalog";
import { SiteHeader } from "@/components/site/shared/site-header";
import { UnitDetailGallery } from "@/components/site/unit-detail/unit-detail-gallery";
import { UnitDetailPageHero } from "@/components/site/unit-detail/unit-detail-page-hero";
import { UnitDetailSidebar } from "@/components/site/unit-detail/unit-detail-sidebar";

export function UnitDetailPage({ unit }: { unit: CatalogUnit }) {
  return (
    <main className="relative overflow-hidden">
      <section className="hero-grid relative">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <SiteHeader />
          <UnitDetailPageHero unit={unit} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <UnitDetailGallery unit={unit} />
          <UnitDetailSidebar unit={unit} />
        </div>
      </section>
    </main>
  );
}
