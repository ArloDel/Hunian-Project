"use client";

import { LoaderCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { OwnerFinanceCard } from "@/components/site/owner/owner-finance-card";
import { OwnerPageHeader } from "@/components/site/owner/owner-page-header";
import { useOwnerDashboard } from "@/components/site/owner/use-owner-dashboard";
import { toUnitForm, buildOwnerStats } from "@/components/site/owner/owner-page.utils";
import { OwnerPaymentQueue } from "@/components/site/owner/owner-payment-queue";
import { OwnerStatsGrid } from "@/components/site/owner/owner-stats-grid";
import { OwnerUnitFormCard } from "@/components/site/owner/owner-unit-form-card";
import { OwnerUnitManagementCard } from "@/components/site/owner/owner-unit-management-card";
import { Card, CardContent } from "@/components/ui/card";

export function OwnerPage() {
  const { data: session, isPending } = authClient.useSession();
  const {
    dashboard,
    message,
    loading,
    unitForm,
    isSavingUnit,
    isUploadingUnitImage,
    bookingRoomNumbers,
    busyBookingId,
    setUnitForm,
    setUnitField,
    setBookingRoomNumbers,
    handleUnitImageUpload,
    handleSaveUnit,
    handleDeleteUnit,
    handleBookingAction,
    resetUnitForm,
  } = useOwnerDashboard();

  const stats = dashboard ? buildOwnerStats(dashboard.summary) : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <OwnerPageHeader isPending={isPending} userName={session?.user?.name} />

      {message ? (
        <Card className="rounded-[24px]">
          <CardContent className="p-4 text-sm">{message}</CardContent>
        </Card>
      ) : null}

      {loading ? (
        <Card className="rounded-[30px]">
          <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            Memuat dashboard owner...
          </CardContent>
        </Card>
      ) : (
        <>
          <OwnerStatsGrid stats={stats} />

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-5">
              <OwnerPaymentQueue
                items={dashboard?.pendingPaymentItems ?? []}
                bookingRoomNumbers={bookingRoomNumbers}
                busyBookingId={busyBookingId}
                onRoomNumberChange={(bookingId, value) =>
                  setBookingRoomNumbers((current) => ({
                    ...current,
                    [bookingId]: value,
                  }))
                }
                onBookingAction={handleBookingAction}
              />
              <OwnerUnitFormCard
                unitForm={unitForm}
                isSavingUnit={isSavingUnit}
                isUploadingUnitImage={isUploadingUnitImage}
                onFieldChange={setUnitField}
                onUpload={handleUnitImageUpload}
                onSave={handleSaveUnit}
                onReset={resetUnitForm}
              />
            </div>

            {dashboard ? (
              <div className="grid gap-5">
                <OwnerUnitManagementCard
                  unitsByType={dashboard.unitsByType}
                  managedUnits={dashboard.managedUnits}
                  onEdit={(unit) => setUnitForm(toUnitForm(unit))}
                  onDelete={handleDeleteUnit}
                />
                <OwnerFinanceCard summary={dashboard.summary} />
              </div>
            ) : null}
          </div>
        </>
      )}
    </main>
  );
}
