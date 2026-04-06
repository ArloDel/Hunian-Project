import { json } from "@/lib/api";

export async function GET() {
  return json({
    status: "ok",
    service: "hunian-mahmudah-api",
    timestamp: new Date().toISOString(),
  });
}
