'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Search,
  Filter,
  Eye,
  Save,
  LogOut,
  MapPin,
  CalendarDays,
  Tag,
  UserRound,
  AlertCircle,
  MessageSquareText,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
};

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
  selesai: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
  ditolak: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
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

export default function AdminPage() {
  const router = useRouter();

  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      if (!profile || profile.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setAdminProfile(profile);

      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(
          'id, user_id, title, category, location, description, image_url, status, admin_note, created_at, updated_at'
        )
        .order('created_at', { ascending: false });

      if (reportError) {
        throw new Error(reportError.message);
      }

      setReports(reportData || []);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memuat dashboard admin.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const keyword = searchQuery.toLowerCase();

      const matchesSearch =
        report.title.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword) ||
        report.location.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword) ||
        report.status.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      baru: reports.filter((report) => report.status === 'baru').length,
      diproses: reports.filter((report) => report.status === 'diproses').length,
      selesai: reports.filter((report) => report.status === 'selesai').length,
      ditolak: reports.filter((report) => report.status === 'ditolak').length,
    };
  }, [reports]);

  const openDetail = (report: Report) => {
    setSelectedReport(report);
    setUpdateStatus(report.status);
    setAdminNote(report.admin_note || '');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: updateStatus,
          admin_note: adminNote.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedReport.id);

      if (error) {
        throw new Error(error.message);
      }

      setReports((prev) =>
        prev.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: updateStatus,
                admin_note: adminNote.trim() || null,
                updated_at: new Date().toISOString(),
              }
            : report
        )
      );

      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              status: updateStatus,
              admin_note: adminNote.trim() || null,
              updated_at: new Date().toISOString(),
            }
          : prev
      );

      setSuccessMessage('Status laporan berhasil diperbarui.');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memperbarui laporan.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-200/70">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Memuat dashboard admin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-slate-950">
                Admin SIPADU
              </p>
              <p className="text-sm text-slate-500">
                Panel pengelolaan laporan
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-950">
                {adminProfile?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 p-6 shadow-xl shadow-blue-600/15 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative z-10">
            <Badge className="mb-4 rounded-full bg-white/15 px-4 py-2 text-white hover:bg-white/15">
              Admin Control Center
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Kelola Laporan Pengaduan
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-blue-50">
              Pantau seluruh laporan dari masyarakat, ubah status penanganan,
              dan berikan catatan tindak lanjut agar user bisa memantau progres.
            </p>
          </div>
        </section>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Total Laporan</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold text-slate-950">{stats.total}</p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">Baru</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold text-blue-600">{stats.baru}</p>
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
                <p className="text-4xl font-bold text-amber-600">
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
                <p className="text-4xl font-bold text-emerald-600">
                  {stats.selesai}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <CardHeader className="border-b border-slate-100 px-7 py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
                  Semua Laporan Masuk
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-500">
                  Ditemukan {filteredReports.length} laporan dari total{' '}
                  {reports.length} laporan.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={loadAdminData}
                className="h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-7">
            <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari judul, kategori, lokasi, deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600"
                  style={{ paddingLeft: '48px' }}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    {filteredReports.map((report) => (
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
                            className={`rounded-full px-3 py-1 font-semibold ${getStatusBadgeClass(
                              report.status
                            )}`}
                          >
                            {getStatusLabel(report.status)}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-6 py-5 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openDetail(report)}
                            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog
        open={!!selectedReport}
        onOpenChange={(open) => {
          if (!open) setSelectedReport(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-[28px] border-slate-200 p-0">
          {selectedReport && (
            <>
              <DialogHeader className="border-b border-slate-100 px-7 py-6">
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-950">
                  Update Laporan
                </DialogTitle>
                <DialogDescription className="mt-1 text-slate-500">
                  Ubah status dan tambahkan catatan tindak lanjut untuk user.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 px-7 py-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-5">
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
                            Tanggal
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
                    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                      <img
                        src={selectedReport.image_url}
                        alt={selectedReport.title}
                        className="max-h-[320px] w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                      <ImageIcon className="h-5 w-5" />
                      Laporan ini tidak memiliki foto bukti.
                    </div>
                  )}
                </div>

                <div className="space-y-5 rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Status Laporan
                    </label>

                    <Select value={updateStatus} onValueChange={setUpdateStatus}>
                      <SelectTrigger className="mt-2 h-12 rounded-2xl border-slate-200 bg-white">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="baru">Baru</SelectItem>
                        <SelectItem value="diproses">Diproses</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Catatan Admin
                    </label>

                    <Textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Contoh: Laporan sudah diteruskan ke dinas terkait dan sedang dalam pengecekan lapangan."
                      className="mt-2 min-h-36 resize-none rounded-2xl border-slate-200 bg-white p-4 text-sm"
                    />
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-700">
                    <div className="mb-2 flex items-center gap-2 font-bold">
                      <MessageSquareText className="h-4 w-4" />
                      Catatan ini terlihat oleh user
                    </div>
                    Setelah disimpan, user dapat melihat update di halaman
                    Laporan Saya.
                  </div>

                  <Button
                    type="button"
                    onClick={handleUpdateReport}
                    disabled={isUpdating}
                    className="h-12 w-full rounded-2xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Simpan Update
                      </>
                    )}
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