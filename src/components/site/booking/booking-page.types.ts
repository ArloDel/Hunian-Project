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
  paymentStatus: string;
  paymentProofUrl: string | null;
  roomNumber: string | null;
  unit: {
    name: string;
    location?: string;
  } | null;
};

export type BookingFormState = {
  phoneNumber: string;
  ktpImageUrl: string;
  paymentProofUrl: string;
  checkInDate: string;
  durationMonths: string;
  unitId: string;
  notes: string;
};

export const initialBookingForm: BookingFormState = {
  phoneNumber: "",
  ktpImageUrl: "",
  paymentProofUrl: "",
  checkInDate: "",
  durationMonths: "12",
  unitId: "",
  notes: "",
};
