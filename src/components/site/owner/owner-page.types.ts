type OwnerBookingItem = {
  id: string;
  bookingCode: string;
  totalPrice: string;
  checkInDate: string | Date;
  createdAt: string | Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentMethod: "manual_transfer" | "xendit";
  paymentStatus: "unpaid" | "proof_uploaded" | "verified" | "rejected" | "expired";
  paymentProofUrl: string | null;
  paymentProvider: string | null;
  paymentUrl: string | null;
  roomNumber: string | null;
  paidAt: string | Date | null;
  verifiedAt: string | Date | null;
  unit: { name: string; location: string } | null;
  user: { name: string; email: string } | null;
};

export type DashboardPayload = {
  summary: {
    activeTenants: number;
    emptyUnits: number;
    monthlyRevenue: string;
    pendingPayments: number;
    pendingBookings: number;
    occupancyRate: number;
    invoicesThisMonth: number;
    totalUnits: number;
  };
  unitsByType: Array<{
    type: string;
    total: number;
    available: number;
  }>;
  ownerBookings: OwnerBookingItem[];
  managedUnits: Array<{
    id: string;
    name: string;
    type: "kost" | "kontrakan";
    location: string;
    address: string | null;
    description: string | null;
    price: string;
    stock: number;
    availableRooms: number;
    facilities: string[];
    imageUrls: string[];
    isPublished: boolean;
  }>;
};

export type UnitFormState = {
  id?: string;
  name: string;
  type: "kost" | "kontrakan";
  location: string;
  address: string;
  description: string;
  price: string;
  stock: string;
  availableRooms: string;
  facilities: string;
  imageUrls: string[];
  isPublished: boolean;
};

export const initialUnitForm: UnitFormState = {
  name: "",
  type: "kost",
  location: "",
  address: "",
  description: "",
  price: "",
  stock: "1",
  availableRooms: "1",
  facilities: "",
  imageUrls: [],
  isPublished: true,
};
