"use client";

import { useEffect, useState } from "react";

import type { DashboardPayload, UnitFormState } from "@/components/site/owner/owner-page.types";
import { initialUnitForm } from "@/components/site/owner/owner-page.types";
import {
  deleteOwnerUnit,
  fetchOwnerDashboard,
  saveOwnerUnit,
  updateOwnerBooking,
  uploadOwnerFile,
} from "@/components/site/owner/owner-page.api";

export function useOwnerDashboard() {
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unitForm, setUnitForm] = useState<UnitFormState>(initialUnitForm);
  const [isSavingUnit, setIsSavingUnit] = useState(false);
  const [isUploadingUnitImage, setIsUploadingUnitImage] = useState(false);
  const [bookingRoomNumbers, setBookingRoomNumbers] = useState<Record<string, string>>({});
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setDashboard(await fetchOwnerDashboard());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Dashboard owner tidak dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const setUnitField = (key: keyof UnitFormState, value: string | boolean | string[]) => {
    setUnitForm((current) => ({ ...current, [key]: value }));
  };

  const resetUnitForm = () => {
    setUnitForm(initialUnitForm);
  };

  const handleUnitImageUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    setIsUploadingUnitImage(true);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(fileList).map((file) => uploadOwnerFile(file, "unit-image")),
      );
      setUnitForm((current) => ({
        ...current,
        imageUrls: [...current.imageUrls, ...uploadedUrls],
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload gambar unit gagal.");
    } finally {
      setIsUploadingUnitImage(false);
    }
  };

  const handleSaveUnit = async () => {
    setIsSavingUnit(true);
    setMessage("");
    try {
      const result = await saveOwnerUnit(unitForm);
      setMessage(result.message ?? "Unit berhasil disimpan.");
      resetUnitForm();
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menyimpan unit gagal.");
    } finally {
      setIsSavingUnit(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!window.confirm("Hapus unit ini?")) return;

    try {
      const result = await deleteOwnerUnit(unitId);
      if (unitForm.id === unitId) resetUnitForm();
      setMessage(result.message ?? "Unit berhasil dihapus.");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menghapus unit gagal.");
    }
  };

  const handleBookingAction = async (bookingId: string, action: "verified" | "rejected") => {
    setBusyBookingId(bookingId);
    try {
      await updateOwnerBooking(bookingId, action, bookingRoomNumbers[bookingId]);
      setMessage(
        action === "verified"
          ? "Booking berhasil diverifikasi."
          : "Bukti transfer ditandai perlu perbaikan.",
      );
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Memperbarui booking gagal.");
    } finally {
      setBusyBookingId(null);
    }
  };

  return {
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
  };
}
