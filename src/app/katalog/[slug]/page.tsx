import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UnitDetailPage } from "@/components/site/unit-detail/unit-detail-page";
import { getCatalogUnitBySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getCatalogUnitBySlug(slug);

  if (!unit) {
    return {
      title: "Unit Tidak Ditemukan | Hunian Mahmudah",
    };
  }

  return {
    title: `${unit.name} | Hunian Mahmudah`,
    description:
      unit.description ??
      `${unit.name} di ${unit.location} dengan harga ${unit.price} per bulan.`,
  };
}

export default async function UnitDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = await getCatalogUnitBySlug(slug);

  if (!unit) {
    notFound();
  }

  return <UnitDetailPage unit={unit} />;
}
