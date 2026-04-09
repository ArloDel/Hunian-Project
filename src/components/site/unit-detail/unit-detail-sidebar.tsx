import { BedDouble, House, MapPin } from "lucide-react";

import { getCatalogAvailabilityLabel, getCatalogUnitTypeLabel, type CatalogUnit } from "@/lib/catalog";
import { unitSellingPoints } from "@/components/site/unit-detail/unit-detail-page.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UnitDetailSidebar({ unit }: { unit: CatalogUnit }) {
  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px]">
        <CardHeader>
          <CardTitle className="text-2xl">Informasi lokasi dan unit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
              <MapPin className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Lokasi</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{unit.location}</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
              <House className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Tipe hunian</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{getCatalogUnitTypeLabel(unit.type)}</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[24px] bg-muted/55 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
              <BedDouble className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Status ketersediaan</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{getCatalogAvailabilityLabel(unit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Kenapa halaman ini penting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unitSellingPoints.map((point) => (
            <div key={point.title} className="rounded-[24px] bg-white/10 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/14">
                  <point.icon className="size-4" />
                </div>
                <p className="font-semibold">{point.title}</p>
              </div>
              <p className="text-sm leading-6 text-white/75">{point.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
