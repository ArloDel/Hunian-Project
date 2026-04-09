import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CatalogUnit } from "@/lib/catalog";
import { formatCatalogPrice } from "@/lib/catalog";
import { homeFacilities, homeOwnerStats } from "@/components/site/home/home-page.data";
import { SiteHeader } from "@/components/site/shared/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeHeroSection({ featuredUnit, unitCount }: { featuredUnit?: CatalogUnit; unitCount: number }) {
  return (
    <section className="hero-grid relative">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6 py-4">
            <Badge variant="accent" className="w-fit">
              Platform digital untuk kost dan kontrakan
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                Cari hunian yang rapi, jelas harganya, dan bisa langsung dibooking.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Hunian Mahmudah membantu calon penyewa melihat unit, mengecek fasilitas, memilih
                tanggal masuk, lalu menyelesaikan booking tanpa perlu datang berkali-kali ke lokasi.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/booking">
                  Pesan Sekarang
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/katalog">Lihat Semua Katalog</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {homeOwnerStats.map((stat) => (
                <Card key={stat.label} className="rounded-[24px]">
                  <CardHeader className="pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className="text-2xl">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{stat.detail}</CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[32px] border-white/70">
            <CardContent className="p-0">
              <div className="bg-[linear-gradient(140deg,#23493f_0%,#2d6456_35%,#f0c77b_140%)] p-6 text-secondary-foreground sm:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <Badge className="bg-white/16 text-white" variant="outline">
                    Featured Stay
                  </Badge>
                  <span className="text-sm text-white/80">
                    {featuredUnit
                      ? `${formatCatalogPrice(featuredUnit.price)}/bulan`
                      : "Mulai dari Rp1,5 jt"}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
                    <p className="text-sm text-white/75">Unit paling dicari minggu ini</p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {featuredUnit?.name ?? "Katalog sedang disiapkan"}
                    </h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                      {featuredUnit?.description ??
                        "Unit akan tampil otomatis dari database begitu katalog aktif di dashboard owner."}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {homeFacilities.map((facility) => (
                      <div
                        key={facility.label}
                        className="rounded-[24px] border border-white/15 bg-white/10 p-4"
                      >
                        <facility.icon className="mb-3 size-5" />
                        <p className="text-sm font-medium">{facility.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <p className="text-sm text-muted-foreground">Status katalog</p>
                  <p className="mt-2 text-xl font-semibold">{unitCount} unit dipublikasikan</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notifikasi aktif</p>
                  <p className="mt-2 text-xl font-semibold">WA dan email H-5 jatuh tempo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
