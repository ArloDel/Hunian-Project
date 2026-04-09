"use client";

import { Building2, ReceiptText } from "lucide-react";

import type { DashboardPayload } from "@/components/site/owner/owner-page.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OwnerFinanceCard({
  summary,
}: {
  summary: DashboardPayload["summary"];
}) {
  return (
    <Card className="rounded-[30px]">
      <CardHeader>
        <CardTitle>Laporan keuangan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[24px] bg-muted/60 p-4">
          <div className="mb-2 flex items-center gap-3">
            <Building2 className="size-5 text-primary" />
            <p className="font-medium">Occupancy rate</p>
          </div>
          <p className="text-3xl font-semibold">{summary.occupancyRate}%</p>
        </div>
        <div className="rounded-[24px] bg-muted/60 p-4">
          <div className="mb-2 flex items-center gap-3">
            <ReceiptText className="size-5 text-primary" />
            <p className="font-medium">Invoice terbit bulan ini</p>
          </div>
          <p className="text-3xl font-semibold">{summary.invoicesThisMonth}</p>
        </div>
      </CardContent>
    </Card>
  );
}
