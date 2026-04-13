"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { BookingRecord, BookingUnitRecord } from "@/components/site/booking/booking-page.types";
import { initialBookingForm } from "@/components/site/booking/booking-page.types";
import { createBooking, fetchBookingHistory, fetchBookingUnits, updateBookingUserProfile } from "@/components/site/booking/booking-page.api";
import { calculateBookingTotal, findRequestedBookingUnit, updateBookingFormField, uploadBookingFile } from "@/components/site/booking/booking-page.utils";

export function useBookingFlow(isLoggedIn: boolean) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<BookingUnitRecord[]>([]);
  const [form, setForm] = useState(initialBookingForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isUploadingKtp, setIsUploadingKtp] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const unitList = await fetchBookingUnits();
        setUnits(unitList);

        const matchedUnit = findRequestedBookingUnit(
          unitList,
          searchParams.get("unitId"),
          searchParams.get("slug"),
        );

        if (matchedUnit) {
          setForm((current) => ({ ...current, unitId: matchedUnit.id }));
        }
      } catch {
        setStatus("Gagal memuat daftar unit.");
      } finally {
        setIsLoadingUnits(false);
      }
    };

    loadUnits();
  }, [searchParams]);

  useEffect(() => {
    const loadBookings = async () => {
      if (!isLoggedIn) {
        setBookingHistory([]);
        return;
      }

      setIsLoadingBookings(true);
      try {
        setBookingHistory(await fetchBookingHistory());
      } catch {
        setBookingHistory([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadBookings();
  }, [isLoggedIn]);

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === form.unitId) ?? null,
    [form.unitId, units],
  );
  const isPrefilledFromCatalog = Boolean(searchParams.get("unitId") || searchParams.get("slug"));
  const paymentFeedback = useMemo(() => {
    const payment = searchParams.get("payment");
    const booking = searchParams.get("booking");

    if (!payment || !booking) {
      return "";
    }

    if (payment === "success") {
      return `Pembayaran untuk booking ${booking} berhasil diproses. Status akan diperbarui otomatis beberapa saat lagi.`;
    }

    if (payment === "failed") {
      return `Pembayaran untuk booking ${booking} belum selesai. Anda bisa melanjutkan checkout dari riwayat booking.`;
    }

    return "";
  }, [searchParams]);
  const totalTagihan = useMemo(
    () => calculateBookingTotal(selectedUnit, form.durationMonths, form.paymentMethod),
    [form.durationMonths, form.paymentMethod, selectedUnit],
  );

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => updateBookingFormField(current, key, value));
  };

  const setUploadingState = (kind: "ktp" | "payment-proof", value: boolean) => {
    if (kind === "ktp") {
      setIsUploadingKtp(value);
      return;
    }

    setIsUploadingProof(value);
  };

  const handleFileUpload = async (fileList: FileList | null, kind: "ktp" | "payment-proof") => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingState(kind, true);
      const url = await uploadBookingFile(file, kind);
      handleChange(kind === "ktp" ? "ktpImageUrl" : "paymentProofUrl", url);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload file gagal.");
    } finally {
      setUploadingState(kind, false);
    }
  };

  const handleBooking = async () => {
    if (!isLoggedIn) {
      router.push("/auth?mode=login&next=%2Fbooking");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const booking = await createBooking(form);
      await updateBookingUserProfile(form);
      setStatus(
        form.paymentMethod === "xendit"
          ? `Booking berhasil dibuat dengan kode ${booking.bookingCode ?? "-"}.\nAnda akan diarahkan ke checkout Xendit.`
          : `Booking berhasil dibuat dengan kode ${booking.bookingCode ?? "-"}.\nSilakan tunggu verifikasi owner.`,
      );
      setBookingHistory((current) => [booking, ...current]);
      setForm((current) => ({
        ...initialBookingForm,
        phoneNumber: current.phoneNumber,
        ktpImageUrl: current.ktpImageUrl,
        checkInDate: current.checkInDate,
        durationMonths: current.durationMonths,
        unitId: current.unitId,
        paymentMethod: current.paymentMethod,
      }));

      if (form.paymentMethod === "xendit" && booking.paymentUrl) {
        window.location.assign(booking.paymentUrl);
        return;
      }

      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Booking gagal diproses.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    paymentFeedback,
    totalTagihan,
    handleChange,
    handleFileUpload,
    handleBooking,
  };
}
