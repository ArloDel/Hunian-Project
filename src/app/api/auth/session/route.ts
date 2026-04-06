import { type NextRequest } from "next/server";

import { handleApiError, json } from "@/lib/api";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return json({ session });
  } catch (error) {
    return handleApiError(error);
  }
}
