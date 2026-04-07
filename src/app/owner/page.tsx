import { OwnerPage } from "@/components/site/owner-page";
import { requireRoleRoute } from "@/lib/auth-guard";

export default async function Owner() {
  await requireRoleRoute("owner", "/owner");
  return <OwnerPage />;
}
