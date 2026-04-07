"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut, ShieldCheck, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <header className="glass-card flex items-center justify-between rounded-full border border-white/70 px-4 py-3 sm:px-6">
      <div>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Hunian Mahmudah
        </Link>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Booking kost dan kontrakan yang terasa lebih tenang
        </p>
      </div>

      <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
        <Link href="/katalog">Katalog</Link>
        <Link href="/#booking">Booking</Link>
        <Link href="/#owner">Owner</Link>
        <Link href="/#faq">Keunggulan</Link>
      </div>

      <div className="flex items-center gap-2">
        {isPending ? (
          <div className="flex h-11 items-center rounded-full px-4 text-sm text-muted-foreground">
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Memuat sesi
          </div>
        ) : session?.user ? (
          <>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <UserRound className="mr-1 size-3.5" />
              {session.user.name}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href="/booking">
                <ShieldCheck className="size-4" />
                Booking
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="size-4" />
              Keluar
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth?mode=login">Masuk</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth?mode=register">Daftar</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
