import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";

import type { CatalogAvailability } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getAvailabilityCopy(availability: CatalogAvailability) {
  if (availability === "available") {
    return "Hanya menampilkan unit yang masih bisa dibooking.";
  }

  if (availability === "full") {
    return "Menampilkan unit yang sudah penuh untuk membantu pemantauan stok.";
  }

  return "Menampilkan seluruh katalog kost dan kontrakan, dari yang masih tersedia sampai yang sudah penuh.";
}

type CatalogPageHeroProps = {
  availability: CatalogAvailability;
  type: "all" | "kost" | "kontrakan";
  total: number;
};

export function CatalogPageHero({ availability, type, total }: CatalogPageHeroProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[32px] border-white/70 bg-white/80">
        <CardHeader className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="size-4" />
            Kembali ke beranda
          </Link>
          <Badge variant="accent" className="w-fit">
            Katalog Lengkap
          </Badge>
          <CardTitle className="font-serif text-4xl leading-tight sm:text-5xl">
            Semua katalog Hunian Mahmudah dalam satu halaman.
          </CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7">
            {getAvailabilityCopy(availability)}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="rounded-[32px]">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="size-4" />
            Filter cepat
          </div>
          <CardTitle className="text-2xl">Lihat katalog sesuai kebutuhan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant={availability === "all" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?type=${type}`}>Semua status</Link>
            </Button>
            <Button asChild variant={availability === "available" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?availability=available&type=${type}`}>Tersedia</Link>
            </Button>
            <Button asChild variant={availability === "full" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?availability=full&type=${type}`}>Penuh</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant={type === "all" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?availability=${availability}`}>Semua tipe</Link>
            </Button>
            <Button asChild variant={type === "kost" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?availability=${availability}&type=kost`}>Kost</Link>
            </Button>
            <Button asChild variant={type === "kontrakan" ? "default" : "outline"} size="sm">
              <Link href={`/katalog?availability=${availability}&type=kontrakan`}>Kontrakan</Link>
            </Button>
          </div>
          <div className="rounded-[24px] bg-muted/60 p-4 text-sm text-muted-foreground">
            Total unit tampil: <span className="font-semibold text-foreground">{total}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
