'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  Tag,
  FileText,
  ArrowLeft,
  Plus,
  RefreshCcw,
  Inbox,
  AlertCircle,
  ImageIcon,
  MessageSquareText,
  XCircle,
  Clock3,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Report = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image_url: string | null;
  status: 'baru' | 'diproses' | 'selesai' | 'ditolak' | string;
  admin_note: string | null;
  created_at: string;
  updated_at: string | null;
};

const statusLabel: Record<string, string> = {
  baru: 'Baru',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

const statusBadgeClass: Record<string, string> = {
  baru: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50',
  diproses: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
  selesai:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
  ditolak: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
};

const statusIcon: Record<string, React.ReactNode> = {
  baru: <FileText className="h-4 w-4" />,
  diproses: <Clock3 className="h-4 w-4" />,
  selesai: <CheckCircle2 className="h-4 w-4" />,
  ditolak: <XCircle className="h-4 w-4" />,
};

function getStatusLabel(status: string) {
  return statusLabel[status] || status;
}

function getStatusBadgeClass(status: string) {
  return (
    statusBadgeClass[status] ||
    'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50'
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function LaporanSayaPage() {
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const itemsPerPage = 6;

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase
        .from('reports')
        .select(
          'id, user_id, title, category, location, description, image_url, status, admin_note, created_at, updated_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setReports(data || []);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memuat laporan.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const keyword = searchQuery.toLowerCase();

      const matchesSearch =
        report.title.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword) ||
        report.location.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage));

  const paginatedReports = useMemo(() => {
    return filteredReports.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredReports, currentPage]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      baru: reports.filter((report) => report.status === 'baru').length,
      diproses: reports.filter((report) => report.status === 'diproses').length,
      selesai: reports.filter((report) => report.status === 'selesai').length,
      ditolak: reports.filter((report) => report.status === 'ditolak').length,
    };
  }, [reports]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-32 animate-pulse rounded-[32px] bg-white shadow-sm" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
          <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Laporan Saya
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500">
              Lihat seluruh laporan pengaduan yang sudah Anda kirim dan pantau
              status tindak lanjut dari admin.
            </p>
          </div>

          <Link href="/dashboard/laporan-baru">
            <Button className="h-12 rounded-2xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
              <Plus className="mr-2 h-5 w-5" />
              Buat Laporan Baru
            </Button>
          </Link>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Gagal memuat laporan</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadReports}
              className="rounded-xl border-red-200 bg-white text-red-700 hover:bg-red-50"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Total Laporan</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-slate-950">
                  {stats.total}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Diproses</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-amber-600">
                  {stats.diproses}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Clock3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Selesai</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-emerald-600">
                  {stats.selesai}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Ditolak</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-red-600">
                  {stats.ditolak}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <CardHeader className="border-b border-slate-100 px-7 py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
                  Daftar Laporan
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-500">
                  Ditemukan {filteredReports.length} laporan dari total{' '}
                  {reports.length} laporan.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={loadReports}
                className="h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-7">
            {/* Search + Filter */}
            <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <Input
                  placeholder="Cari judul, kategori, lokasi, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600"
                  style={{
                    paddingLeft: '48px',
                  }}
                />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-600">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-400" />
                    <SelectValue placeholder="Filter status" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="diproses">Diproses</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {paginatedReports.length === 0 ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm">
                  <Inbox className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  Tidak ada laporan ditemukan
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Coba ubah kata kunci pencarian atau filter status. Kalau belum
                  punya laporan, buat laporan baru terlebih dahulu.
                </p>

                <Link href="/dashboard/laporan-baru" className="mt-6">
                  <Button className="h-11 rounded-2xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Laporan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[24px] border border-slate-100">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50 hover:bg-slate-50">
                        <TableHead className="px-6 py-4 text-slate-500">
                          Laporan
                        </TableHead>
                        <TableHead className="hidden px-6 py-4 text-slate-500 md:table-cell">
                          Kategori
                        </TableHead>
                        <TableHead className="hidden px-6 py-4 text-slate-500 lg:table-cell">
                          Lokasi
                        </TableHead>
                        <TableHead className="hidden px-6 py-4 text-slate-500 sm:table-cell">
                          Tanggal
                        </TableHead>
                        <TableHead className="px-6 py-4 text-slate-500">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-4 text-right text-slate-500">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedReports.map((report) => (
                        <TableRow
                          key={report.id}
                          className="border-slate-100 hover:bg-slate-50/70"
                        >
                          <TableCell className="px-6 py-5">
                            <div className="max-w-[360px]">
                              <p className="font-semibold text-slate-950">
                                {report.title}
                              </p>

                              <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                                {report.description}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400 md:hidden">
                                <span>{report.category}</span>
                                <span>•</span>
                                <span>{formatDate(report.created_at)}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 md:table-cell">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Tag className="h-4 w-4" />
                              {report.category}
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 lg:table-cell">
                            <div className="flex max-w-[220px] items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="truncate">{report.location}</span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 sm:table-cell">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(report.created_at)}
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-5">
                            <Badge
                              variant="outline"
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${getStatusBadgeClass(
                                report.status
                              )}`}
                            >
                              {statusIcon[report.status]}
                              {getStatusLabel(report.status)}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-6 py-5 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredReports.length > 0 && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Halaman <span className="font-semibold">{currentPage}</span>{' '}
                  dari <span className="font-semibold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="h-10 rounded-xl border-slate-200"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Sebelumnya
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="h-10 rounded-xl border-slate-200"
                  >
                    Berikutnya
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => {
          if (!open) setSelectedReport(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-[28px] border-slate-200 p-0">
          {selectedReport && (
            <>
              <DialogHeader className="border-b border-slate-100 px-7 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-950">
                      Detail Laporan
                    </DialogTitle>

                    <DialogDescription className="mt-1 text-slate-500">
                      ID Laporan: {selectedReport.id}
                    </DialogDescription>
                  </div>

                  <Badge
                    variant="outline"
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-semibold ${getStatusBadgeClass(
                      selectedReport.status
                    )}`}
                  >
                    {statusIcon[selectedReport.status]}
                    {getStatusLabel(selectedReport.status)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 px-7 py-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    {selectedReport.title}
                  </h3>

                  <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Tag className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Kategori
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {selectedReport.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Tanggal Dibuat
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {formatDateTime(selectedReport.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:col-span-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Lokasi
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {selectedReport.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedReport.image_url ? (
                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700">
                      Foto Bukti
                    </p>

                    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                      <img
                        src={selectedReport.image_url}
                        alt={selectedReport.title}
                        className="max-h-[360px] w-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                    <ImageIcon className="h-5 w-5" />
                    Laporan ini tidak memiliki foto bukti.
                  </div>
                )}

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Catatan Admin
                  </p>

                  <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-blue-700">
                    <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                      {selectedReport.admin_note ||
                        'Belum ada catatan dari admin untuk laporan ini.'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setSelectedReport(null)}
                  >
                    Tutup Detail
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}