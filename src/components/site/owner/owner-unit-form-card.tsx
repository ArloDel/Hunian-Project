"use client";

import { HousePlus, LoaderCircle, Save, Upload } from "lucide-react";

import type { UnitFormState } from "@/components/site/owner/owner-page.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type OwnerUnitFormCardProps = {
  unitForm: UnitFormState;
  isSavingUnit: boolean;
  isUploadingUnitImage: boolean;
  onFieldChange: (key: keyof UnitFormState, value: string | boolean | string[]) => void;
  onUpload: (fileList: FileList | null) => void;
  onSave: () => void;
  onReset: () => void;
};

export function OwnerUnitFormCard({
  unitForm,
  isSavingUnit,
  isUploadingUnitImage,
  onFieldChange,
  onUpload,
  onSave,
  onReset,
}: OwnerUnitFormCardProps) {
  return (
    <Card className="rounded-[30px]">
      <CardHeader>
        <CardTitle>{unitForm.id ? "Edit unit" : "Tambah unit baru"}</CardTitle>
        <CardDescription>
          Form ini terhubung langsung ke endpoint create dan update unit.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Nama unit"
            value={unitForm.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
          />
          <select
            className="flex h-11 w-full rounded-2xl border border-border bg-white/75 px-4 py-2 text-sm outline-none"
            value={unitForm.type}
            onChange={(event) => onFieldChange("type", event.target.value as "kost" | "kontrakan")}
          >
            <option value="kost">Kost</option>
            <option value="kontrakan">Kontrakan</option>
          </select>
          <Input
            placeholder="Lokasi"
            value={unitForm.location}
            onChange={(event) => onFieldChange("location", event.target.value)}
          />
          <Input
            placeholder="Harga"
            value={unitForm.price}
            onChange={(event) => onFieldChange("price", event.target.value)}
          />
          <Input
            placeholder="Stok total"
            value={unitForm.stock}
            onChange={(event) => onFieldChange("stock", event.target.value)}
          />
          <Input
            placeholder="Kamar tersedia"
            value={unitForm.availableRooms}
            onChange={(event) => onFieldChange("availableRooms", event.target.value)}
          />
        </div>
        <Input
          placeholder="Alamat"
          value={unitForm.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
        />
        <Textarea
          placeholder="Deskripsi unit"
          value={unitForm.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
        />
        <Textarea
          placeholder="Fasilitas, pisahkan dengan koma"
          value={unitForm.facilities}
          onChange={(event) => onFieldChange("facilities", event.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="rounded-[22px] border border-dashed border-border p-4 text-sm">
            <p className="font-medium">Upload gambar unit</p>
            <p className="mt-1 text-muted-foreground">
              File akan disimpan ke folder `public/uploads/unit-image`.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {unitForm.imageUrls.map((url) => (
                <Badge key={url} variant="outline">
                  {url.split("/").pop()}
                </Badge>
              ))}
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
            {isUploadingUnitImage ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload Gambar
            <input
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => onUpload(event.target.files)}
            />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={unitForm.isPublished}
            onChange={(event) => onFieldChange("isPublished", event.target.checked)}
          />
          Publikasikan unit ini
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onSave} disabled={isSavingUnit}>
            {isSavingUnit ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : unitForm.id ? (
              <Save className="size-4" />
            ) : (
              <HousePlus className="size-4" />
            )}
            {unitForm.id ? "Simpan Perubahan" : "Tambah Unit"}
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reset Form
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
