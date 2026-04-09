import Link from "next/link";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";

import type { AuthFormState, AuthMode } from "@/components/site/auth/auth-page.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthFormCardProps = {
  mode: AuthMode;
  nextPath: string;
  form: AuthFormState;
  message: string;
  loading: boolean;
  onFieldChange: (key: keyof AuthFormState, value: string) => void;
  onSubmit: () => void;
};

export function AuthFormCard({
  mode,
  nextPath,
  form,
  message,
  loading,
  onFieldChange,
  onSubmit,
}: AuthFormCardProps) {
  const isRegister = mode === "register";

  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Button variant={isRegister ? "outline" : "default"} size="sm" asChild>
            <Link href={`/auth?mode=login&next=${encodeURIComponent(nextPath)}`}>
              <LogIn className="size-4" />
              Login
            </Link>
          </Button>
          <Button variant={isRegister ? "default" : "outline"} size="sm" asChild>
            <Link href={`/auth?mode=register&next=${encodeURIComponent(nextPath)}`}>
              <UserPlus className="size-4" />
              Register
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl">
          {isRegister ? "Buat akun penyewa" : "Masuk ke akun Anda"}
        </CardTitle>
        <CardDescription>
          {isRegister
            ? "Setelah akun aktif, Anda bisa langsung mengirim booking."
            : "Masuk untuk melihat dan membuat booking dengan akun yang sama."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRegister ? (
          <Input
            placeholder="Nama lengkap"
            value={form.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
          />
        ) : null}
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => onFieldChange("password", event.target.value)}
        />
        {isRegister ? (
          <Input
            placeholder="Nomor WhatsApp"
            value={form.phoneNumber}
            onChange={(event) => onFieldChange("phoneNumber", event.target.value)}
          />
        ) : null}
        {message ? <div className="rounded-[20px] bg-muted/80 p-4 text-sm">{message}</div> : null}
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={loading || !form.email || !form.password || (isRegister && !form.name)}
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Memproses
            </>
          ) : isRegister ? (
            "Daftar Sekarang"
          ) : (
            "Masuk Sekarang"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
