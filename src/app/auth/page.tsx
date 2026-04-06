import { AuthPage } from "@/components/site/auth-page";

export default async function Auth({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";
  const nextPath = params.next || "/booking";

  return <AuthPage mode={mode} nextPath={nextPath} />;
}
