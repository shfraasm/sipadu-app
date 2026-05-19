// Dummy data for SIPADU

export type ReportStatus = 'baru' | 'diproses' | 'selesai' | 'ditolak';

export interface Report {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  reporterName: string;
  reporterEmail: string;
  attachments?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export const categories = [
  'Infrastruktur Jalan',
  'Kebersihan Lingkungan',
  'Pelayanan Kesehatan',
  'Pendidikan',
  'Administrasi Kependudukan',
  'Keamanan & Ketertiban',
  'Transportasi Publik',
  'Layanan Air & Listrik',
  'Lainnya',
];

export const dummyReports: Report[] = [
  {
    id: 'RPT-2024-001',
    title: 'Jalan Berlubang di Jl. Sudirman',
    category: 'Infrastruktur Jalan',
    location: 'Jl. Sudirman No. 45, Jakarta Pusat',
    description: 'Terdapat lubang besar di jalan yang membahayakan pengendara motor dan mobil. Sudah ada beberapa kecelakaan kecil akibat lubang ini.',
    status: 'diproses',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    reporterName: 'Ahmad Fauzi',
    reporterEmail: 'ahmad.fauzi@email.com',
  },
  {
    id: 'RPT-2024-002',
    title: 'Sampah Menumpuk di TPS',
    category: 'Kebersihan Lingkungan',
    location: 'TPS Kelurahan Menteng, Jakarta Pusat',
    description: 'Sampah sudah menumpuk selama 1 minggu dan belum diangkut. Menimbulkan bau tidak sedap dan lalat.',
    status: 'selesai',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    reporterName: 'Siti Rahayu',
    reporterEmail: 'siti.rahayu@email.com',
  },
  {
    id: 'RPT-2024-003',
    title: 'Lampu Jalan Mati',
    category: 'Infrastruktur Jalan',
    location: 'Jl. Gatot Subroto Km 5, Jakarta Selatan',
    description: 'Lampu penerangan jalan umum mati selama 2 minggu. Kondisi jalan sangat gelap dan rawan kejahatan.',
    status: 'baru',
    createdAt: '2024-01-18T19:45:00Z',
    updatedAt: '2024-01-18T19:45:00Z',
    reporterName: 'Budi Santoso',
    reporterEmail: 'budi.santoso@email.com',
  },
  {
    id: 'RPT-2024-004',
    title: 'Antrian Panjang di Puskesmas',
    category: 'Pelayanan Kesehatan',
    location: 'Puskesmas Kecamatan Tanah Abang',
    description: 'Antrian pelayanan sangat panjang, waktu tunggu bisa sampai 4 jam. Perlu penambahan loket pelayanan.',
    status: 'diproses',
    createdAt: '2024-01-17T07:00:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    reporterName: 'Dewi Kusuma',
    reporterEmail: 'dewi.kusuma@email.com',
  },
  {
    id: 'RPT-2024-005',
    title: 'Fasilitas Sekolah Rusak',
    category: 'Pendidikan',
    location: 'SDN 01 Menteng, Jakarta Pusat',
    description: 'Atap ruang kelas bocor dan bangku banyak yang rusak. Mengganggu proses belajar mengajar siswa.',
    status: 'ditolak',
    createdAt: '2024-01-10T10:15:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
    reporterName: 'Rini Wulandari',
    reporterEmail: 'rini.wulandari@email.com',
  },
  {
    id: 'RPT-2024-006',
    title: 'KTP Tidak Kunjung Jadi',
    category: 'Administrasi Kependudukan',
    location: 'Kelurahan Gambir, Jakarta Pusat',
    description: 'Sudah mengurus KTP sejak 2 bulan lalu tetapi belum jadi. Petugas selalu bilang masih dalam proses.',
    status: 'selesai',
    createdAt: '2024-01-08T09:30:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    reporterName: 'Eko Prasetyo',
    reporterEmail: 'eko.prasetyo@email.com',
  },
  {
    id: 'RPT-2024-007',
    title: 'Halte Bus Rusak',
    category: 'Transportasi Publik',
    location: 'Halte Bundaran HI, Jakarta Pusat',
    description: 'Atap halte bocor dan kursi tunggu banyak yang rusak. Penumpang kehujanan saat menunggu bus.',
    status: 'baru',
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    reporterName: 'Linda Sari',
    reporterEmail: 'linda.sari@email.com',
  },
  {
    id: 'RPT-2024-008',
    title: 'Air PDAM Keruh',
    category: 'Layanan Air & Listrik',
    location: 'Perumahan Griya Indah, Bekasi',
    description: 'Air PDAM berwarna keruh kecoklatan selama 1 minggu terakhir. Tidak layak untuk dikonsumsi.',
    status: 'diproses',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-18T08:00:00Z',
    reporterName: 'Hendra Wijaya',
    reporterEmail: 'hendra.wijaya@email.com',
  },
];

export const dummyUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@email.com',
    role: 'user',
    createdAt: '2023-12-01T08:00:00Z',
  },
  {
    id: 'USR-002',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@email.com',
    role: 'user',
    createdAt: '2023-12-15T10:30:00Z',
  },
  {
    id: 'USR-003',
    name: 'Admin SIPADU',
    email: 'admin@sipadu.go.id',
    role: 'admin',
    createdAt: '2023-11-01T00:00:00Z',
  },
];

export const statistics = {
  totalReports: 1248,
  completedReports: 892,
  inProgressReports: 245,
  rejectedReports: 56,
  newReports: 55,
  averageResponseTime: '2.5 hari',
};

export const monthlyReportData = [
  { month: 'Jan', laporan: 85 },
  { month: 'Feb', laporan: 92 },
  { month: 'Mar', laporan: 78 },
  { month: 'Apr', laporan: 110 },
  { month: 'Mei', laporan: 125 },
  { month: 'Jun', laporan: 98 },
  { month: 'Jul', laporan: 115 },
  { month: 'Agu', laporan: 130 },
  { month: 'Sep', laporan: 142 },
  { month: 'Okt', laporan: 135 },
  { month: 'Nov', laporan: 118 },
  { month: 'Des', laporan: 120 },
];

export function getStatusColor(status: ReportStatus): string {
  switch (status) {
    case 'baru':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case 'diproses':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'selesai':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'ditolak':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: ReportStatus): string {
  switch (status) {
    case 'baru':
      return 'Baru';
    case 'diproses':
      return 'Diproses';
    case 'selesai':
      return 'Selesai';
    case 'ditolak':
      return 'Ditolak';
    default:
      return status;
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
