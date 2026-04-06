import { and, asc, eq, gte, lte } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { units } from "@/db/schema";
import {
  handleApiError,
  json,
  makeSlug,
  parseBooleanParam,
  parseJsonList,
  parseNumberParam,
  requireRole,
} from "@/lib/api";
import { createUnitSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const minPrice = parseNumberParam(searchParams.get("minPrice"));
    const maxPrice = parseNumberParam(searchParams.get("maxPrice"));
    const availableOnly = parseBooleanParam(searchParams.get("availableOnly"));

    const filters = [
      type ? eq(units.type, type as "kost" | "kontrakan") : undefined,
      location ? eq(units.location, location) : undefined,
      typeof minPrice === "number" ? gte(units.price, String(minPrice)) : undefined,
      typeof maxPrice === "number" ? lte(units.price, String(maxPrice)) : undefined,
      availableOnly ? gte(units.availableRooms, 1) : undefined,
      eq(units.isPublished, true),
    ].filter(Boolean);

    const records = await db
      .select()
      .from(units)
      .where(and(...filters))
      .orderBy(asc(units.price), asc(units.name));

    return json({
      data: records.map((unit) => ({
        ...unit,
        facilities: parseJsonList(unit.facilities),
        imageUrls: parseJsonList(unit.imageUrls),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await requireRole(request, ["owner"]);
    const body = createUnitSchema.parse(await request.json());
    const now = new Date();
    const id = crypto.randomUUID();

    const [created] = await db
      .insert(units)
      .values({
        id,
        name: body.name,
        slug: `${makeSlug(body.name)}-${id.slice(0, 6)}`,
        type: body.type,
        location: body.location,
        address: body.address ?? null,
        description: body.description ?? null,
        price: body.price.toFixed(2),
        stock: body.stock,
        availableRooms: body.availableRooms,
        facilities: JSON.stringify(body.facilities),
        imageUrls: JSON.stringify(body.imageUrls),
        isPublished: body.isPublished,
        createdByUserId: session.user.id,
        createdAt: now,
        updatedAt: now,
      })
      .$returningId();

    return json(
      {
        message: "Unit berhasil dibuat.",
        data: created,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
