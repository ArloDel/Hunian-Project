import { type NextRequest } from "next/server";

import { getAuthSession, handleApiError, json } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request);

    return json({
      authenticated: Boolean(session),
      user: session?.user ?? null,
      session: session?.session ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
