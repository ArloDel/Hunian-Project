import { CircleDollarSign, HousePlus, UserRoundCheck } from "lucide-react";

import type { DashboardPayload, UnitFormState } from "@/components/site/owner/owner-page.types";
import { initialUnitForm } from "@/components/site/owner/owner-page.types";

export function toUnitForm(
  unit?: DashboardPayload["managedUnits"][number] | null,
): UnitFormState {
  if (!unit) {
    return initialUnitForm;
  }

  return {
    id: unit.id,
    name: unit.name,
    type: unit.type,
    location: unit.location,
    address: unit.address ?? "",
    description: unit.description ?? "",
    price: String(Number(unit.price)),
    stock: String(unit.stock),
    availableRooms: String(unit.availableRooms),
    facilities: unit.facilities.join(", "),
    imageUrls: unit.imageUrls,
    isPublished: unit.isPublished,
  };
}

export function buildOwnerStats(summary: DashboardPayload["summary"]) {
  return [
    {
      label: "Total penghuni",
      value: String(summary.activeTenants),
      icon: UserRoundCheck,
      note: `${summary.pendingBookings} booking masih menunggu konfirmasi`,
    },
    {
      label: "Unit kosong",
      value: String(summary.emptyUnits),
      icon: HousePlus,
      note: `Dari total ${summary.totalUnits} unit aktif`,
    },
    {
      label: "Pendapatan bulan ini",
      value: formatCurrency(summary.monthlyRevenue),
      icon: CircleDollarSign,
      note: `${summary.pendingPayments} pembayaran perlu dicek`,
    },
  ];
}

export function formatCurrency(value: string | number) {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

export function createUnitPayload(unitForm: UnitFormState) {
  return {
    name: unitForm.name,
    type: unitForm.type,
    location: unitForm.location,
    address: unitForm.address || null,
    description: unitForm.description || null,
    price: Number(unitForm.price),
    stock: Number(unitForm.stock),
    availableRooms: Number(unitForm.availableRooms),
    facilities: unitForm.facilities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    imageUrls: unitForm.imageUrls,
    isPublished: unitForm.isPublished,
  };
}
