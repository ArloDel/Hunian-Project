import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
      <Separator />
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Hunian Mahmudah dibuat sebagai fondasi frontend untuk platform pemesanan kost yang modern.</p>
        <div className="flex gap-4">
          <Link href="/katalog">Katalog</Link>
          <Link href="/booking">Booking</Link>
        </div>
      </div>
    </footer>
  );
}
