"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type OwnerPageHeaderProps = {
  isPending: boolean;
  userName?: string;
};

export function OwnerPageHeader({ isPending, userName }: OwnerPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
        <Badge variant="secondary" className="w-fit">
          Dashboard Owner
        </Badge>
        <h1 className="font-serif text-4xl tracking-tight">Operasional harian dalam satu layar.</h1>
        <p className="max-w-2xl text-muted-foreground">
          Dashboard ini sekarang mendukung pemantauan booking manual dan Xendit, verifikasi
          pembayaran manual, upload gambar unit, serta CRUD unit langsung dari UI.
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Memuat sesi...</p>
        ) : userName ? (
          <Badge variant="accent">Masuk sebagai {userName}</Badge>
        ) : (
          <Button asChild>
            <Link href="/auth?mode=login&next=%2Fowner">Masuk sebagai owner</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
