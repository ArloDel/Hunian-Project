"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { DashboardPayload } from "@/components/site/owner/owner-page.types";
import { formatCurrency } from "@/components/site/owner/owner-page.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OwnerUnitManagementCardProps = {
  unitsByType: DashboardPayload["unitsByType"];
  managedUnits: DashboardPayload["managedUnits"];
  onEdit: (unit: DashboardPayload["managedUnits"][number]) => void;
  onDelete: (unitId: string) => void;
};

export function OwnerUnitManagementCard({
  unitsByType,
  managedUnits,
  onEdit,
  onDelete,
}: OwnerUnitManagementCardProps) {
  return (
    <div className="grid gap-5">
      <Card className="rounded-[30px] bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Manajemen unit</CardTitle>
          <CardDescription className="text-white/70">
            Ringkasan live stok unit per tipe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {unitsByType.map((item) => (
            <div key={item.type} className="rounded-[22px] bg-white/10 p-4 text-sm">
              {item.type.toUpperCase()} • {item.total} unit • {item.available} kamar/rumah tersedia
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[30px]">
        <CardHeader>
          <CardTitle>Daftar unit aktif</CardTitle>
          <CardDescription>Pilih edit atau hapus unit langsung dari daftar ini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {managedUnits.map((unit) => (
            <div key={unit.id} className="rounded-[24px] border border-border bg-white/75 p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-semibold">{unit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {unit.location} • {unit.type} • {formatCurrency(unit.price)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    tersedia {unit.availableRooms}/{unit.stock}
                  </Badge>
                  <Badge variant={unit.isPublished ? "secondary" : "accent"}>
                    {unit.isPublished ? "published" : "draft"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button size="sm" variant="outline" onClick={() => onEdit(unit)}>
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDelete(unit.id)}>
                    <Trash2 className="size-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
