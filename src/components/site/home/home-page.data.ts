import {
  BadgeCheck,
  CalendarDays,
  Camera,
  MapPin,
  MessagesSquare,
  MoonStar,
  ShieldCheck,
  WalletCards,
  Wifi,
} from "lucide-react";

export const homeSteps = [
  {
    title: "Cari hunian yang pas",
    description:
      "Gunakan filter harga, lokasi, dan tipe kamar untuk menemukan pilihan yang paling cocok dengan kebutuhan harian Anda.",
    icon: MapPin,
  },
  {
    title: "Tentukan check-in dan durasi",
    description:
      "Pilih tanggal masuk, lama sewa, dan lengkapi data diri untuk mengamankan unit sebelum didahului calon penyewa lain.",
    icon: CalendarDays,
  },
  {
    title: "Upload pembayaran dan tunggu verifikasi",
    description:
      "Sistem menyiapkan invoice dan status booking. Admin memverifikasi transfer agar akses kamar dapat dikirim otomatis.",
    icon: WalletCards,
  },
];

export const homeOwnerStats = [
  { label: "Unit aktif", value: "48", detail: "31 kost, 17 kontrakan" },
  { label: "Unit kosong", value: "7", detail: "Prioritas promosi minggu ini" },
  { label: "Pendapatan bulan ini", value: "Rp72,4 jt", detail: "+12% dari bulan lalu" },
];

export const homeFacilities = [
  { label: "WiFi kencang", icon: Wifi },
  { label: "Keamanan CCTV", icon: ShieldCheck },
  { label: "Galeri foto lengkap", icon: Camera },
  { label: "Booking fleksibel", icon: CalendarDays },
];

export const homeAdvantages = [
  {
    title: "Informasi unit transparan",
    text: "Foto, fasilitas, harga, dan stok ditampilkan jelas agar penyewa tidak perlu menebak-nebak.",
    icon: BadgeCheck,
  },
  {
    title: "Pengingat pembayaran otomatis",
    text: "Area notifikasi sudah disiapkan untuk email dan WhatsApp sebelum masa sewa habis.",
    icon: MessagesSquare,
  },
  {
    title: "Aman untuk data identitas",
    text: "Struktur frontend memperhitungkan alur upload KTP yang nantinya bisa dilengkapi enkripsi di backend.",
    icon: ShieldCheck,
  },
];

export const homeRoadmap = [
  {
    text: "Fase 1: katalog, akun user, booking manual, dan upload bukti transfer.",
    icon: MoonStar,
  },
  {
    text: "Fase 2: integrasi payment gateway, virtual account, e-wallet, dan reminder otomatis.",
    icon: WalletCards,
  },
  {
    text: "Fase 3: pelaporan komplain atau maintenance langsung dari dashboard penghuni.",
    icon: MessagesSquare,
  },
];

export const quickBookingSummary = [
  { label: "Biaya sewa", value: "Rp11.100.000" },
  { label: "Biaya admin", value: "Rp150.000" },
  { label: "Total pembayaran", value: "Rp11.250.000" },
];
