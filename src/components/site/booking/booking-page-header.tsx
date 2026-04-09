"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BookingPageHeaderProps = {
  isPending: boolean;
  userName?: string;
  isPrefilledFromCatalog: boolean;
};

export function BookingPageHeader({
  isPending,
  userName,
  isPrefilledFromCatalog,
}: BookingPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
        <Badge variant="accent" className="w-fit">
          Form Booking
        </Badge>
        <h1 className="font-serif text-4xl tracking-tight">Amankan unit sebelum keduluan.</h1>
        <p className="max-w-2xl text-muted-foreground">
          Booking tenant sekarang mendukung upload file nyata untuk KTP dan bukti transfer.
          {isPrefilledFromCatalog
            ? " Unit yang Anda pilih dari katalog juga sudah diprefill otomatis."
            : " Mulailah dengan memilih unit yang ingin Anda pesan terlebih dahulu."}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Memuat sesi...</p>
        ) : userName ? (
          <Badge variant="secondary">Login sebagai {userName}</Badge>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/auth?mode=login&next=%2Fbooking">Masuk untuk booking</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
