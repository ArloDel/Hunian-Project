"use client";

import { BookingFormCard } from "@/components/site/booking/booking-form-card";
import { BookingHistoryCard } from "@/components/site/booking/booking-history-card";
import { BookingPageHeader } from "@/components/site/booking/booking-page-header";
import { BookingSummarySidebar } from "@/components/site/booking/booking-summary-sidebar";
import { useBookingFlow } from "@/components/site/booking/use-booking-flow";
import { authClient } from "@/lib/auth-client";

export function BookingPage() {
  const { data: session, isPending } = authClient.useSession();
  const {
    units,
    form,
    status,
    isSubmitting,
    isLoadingUnits,
    bookingHistory,
    isLoadingBookings,
    isUploadingKtp,
    isUploadingProof,
    selectedUnit,
    isPrefilledFromCatalog,
    totalTagihan,
    handleChange,
    handleFileUpload,
    handleBooking,
  } = useBookingFlow(Boolean(session?.user));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <BookingPageHeader
        isPending={isPending}
        userName={session?.user?.name}
        isPrefilledFromCatalog={isPrefilledFromCatalog}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <BookingFormCard
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          units={units}
          form={form}
          status={status}
          isLoadingUnits={isLoadingUnits}
          isSubmitting={isSubmitting}
          isUploadingKtp={isUploadingKtp}
          isUploadingProof={isUploadingProof}
          onFieldChange={handleChange}
          onFileUpload={handleFileUpload}
          onSubmit={handleBooking}
        />
        <BookingSummarySidebar
          selectedUnit={selectedUnit}
          form={form}
          totalTagihan={totalTagihan}
        />
      </div>

      <BookingHistoryCard
        isLoggedIn={Boolean(session?.user)}
        isLoadingBookings={isLoadingBookings}
        bookingHistory={bookingHistory}
      />
    </main>
  );
}
