import Image from "next/image";
import { MapPin } from "lucide-react";

import { getCatalogGalleryImages, getCatalogUnitTypeLabel, type CatalogUnit } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UnitDetailGallery({ unit }: { unit: CatalogUnit }) {
  const galleryImages = getCatalogGalleryImages(unit.imageUrls);
  const primaryImage = galleryImages[0];
  const secondaryImages = galleryImages.slice(1, 3);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[32px]">
        <CardContent className="p-0">
          <div className="grid gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-border bg-muted/40">
              <Image
                src={primaryImage}
                alt={`Foto utama ${unit.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,36,31,0.08)_0%,rgba(17,36,31,0.72)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white">
                <Badge variant="outline" className="w-fit border-white/35 bg-black/20 text-white">
                  {getCatalogUnitTypeLabel(unit.type)}
                </Badge>
                <div>
                  <p className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="size-4" />
                    {unit.location}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">{unit.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/80">{unit.address ?? unit.location}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {secondaryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative min-h-[152px] overflow-hidden rounded-[28px] border border-border bg-muted/40"
                >
                  <Image
                    src={image}
                    alt={`Foto ${index + 2} ${unit.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,36,31,0.06)_0%,rgba(17,36,31,0.5)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <Badge variant="secondary" className="w-fit bg-white/85 text-foreground">
                      Galeri {index + 1}
                    </Badge>
                    <p className="mt-3 text-sm leading-6 text-white/85">
                      {image.startsWith("/uploads/")
                        ? "Gambar unit diunggah dari dashboard owner dan tampil langsung di halaman detail."
                        : "Galeri unit aktif dari sumber gambar katalog yang tersimpan di database."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px]">
        <CardHeader>
          <CardTitle>Fasilitas unit</CardTitle>
          <CardDescription>Semua fasilitas ini diambil langsung dari data unit yang tersimpan.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {unit.facilities.map((facility) => (
            <Badge key={facility} variant="outline" className="px-4 py-2 text-sm">
              {facility}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
