"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OwnerStatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  note: string;
};

export function OwnerStatsGrid({ stats }: { stats: OwnerStatItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-[30px]">
          <CardHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
              <stat.icon className="size-5 text-primary" />
            </div>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{stat.note}</CardContent>
        </Card>
      ))}
    </div>
  );
}
