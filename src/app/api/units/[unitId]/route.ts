import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

import { db } from "@/db";
import { units } from "@/db/schema";
import {
  ApiError,
  handleApiError,
  json,
  makeSlug,
  parseJsonList,
  requireRole,
} from "@/lib/api";
import { updateUnitSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ unitId: string }> },
) {
  try {
    const { unitId } = await context.params;
    const [unit] = await db.select().from(units).where(eq(units.id, unitId)).limit(1);

    if (!unit) {
      throw new ApiError(404, "Unit tidak ditemukan.");
    }

    return json({
      data: {
        ...unit,
        facilities: parseJsonList(unit.facilities),
        imageUrls: parseJsonList(unit.imageUrls),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ unitId: string }> },
) {
  try {
    await requireRole(request, ["owner"]);
    const { unitId } = await context.params;
    const payload = updateUnitSchema.parse(await request.json());

    const [existing] = await db
      .select()
      .from(units)
      .where(eq(units.id, unitId))
      .limit(1);

    if (!existing) {
      throw new ApiError(404, "Unit tidak ditemukan.");
    }

    await db
      .update(units)
      .set({
        name: payload.name ?? existing.name,
        slug: payload.name ? `${makeSlug(payload.name)}-${unitId.slice(0, 6)}` : existing.slug,
        type: payload.type ?? existing.type,
        location: payload.location ?? existing.location,
        address: payload.address ?? existing.address,
        description: payload.description ?? existing.description,
        price:
          typeof payload.price === "number"
            ? payload.price.toFixed(2)
            : existing.price,
        stock: payload.stock ?? existing.stock,
        availableRooms: payload.availableRooms ?? existing.availableRooms,
        facilities: payload.facilities
          ? JSON.stringify(payload.facilities)
          : existing.facilities,
        imageUrls: payload.imageUrls
          ? JSON.stringify(payload.imageUrls)
          : existing.imageUrls,
        isPublished: payload.isPublished ?? existing.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(units.id, unitId));

    return json({ message: "Unit berhasil diperbarui." });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ unitId: string }> },
) {
  try {
    await requireRole(request, ["owner"]);
    const { unitId } = await context.params;

    await db.delete(units).where(eq(units.id, unitId));

    return json({ message: "Unit berhasil dihapus." });
  } catch (error) {
    return handleApiError(error);
  }
}
