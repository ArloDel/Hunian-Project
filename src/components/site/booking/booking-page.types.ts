export type BookingUnitRecord = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  availableRooms: number;
  facilities: string[];
};

export type BookingRecord = {
  id: string;
  bookingCode: string;
  checkInDate: string | Date;
  durationMonths: number;
  totalPrice: string;
  status: string;
  paymentMethod: "manual_transfer" | "xendit";
  paymentStatus: string;
  paymentProofUrl: string | null;
  paymentProvider: string | null;
  paymentReference: string | null;
  paymentExternalId: string | null;
  paymentUrl: string | null;
  paidAt: string | Date | null;
  roomNumber: string | null;
  unit: {
    name: string;
    location?: string;
  } | null;
};

export type BookingFormState = {
  phoneNumber: string;
  ktpImageUrl: string;
  paymentMethod: "manual_transfer" | "xendit";
  paymentProofUrl: string;
  checkInDate: string;
  durationMonths: string;
  unitId: string;
  notes: string;
};

export const initialBookingForm: BookingFormState = {
  phoneNumber: "",
  ktpImageUrl: "",
  paymentMethod: "manual_transfer",
  paymentProofUrl: "",
  checkInDate: "",
  durationMonths: "12",
  unitId: "",
  notes: "",
};
