'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  RefreshCcw,
  Inbox,
  MapPin,
  CalendarDays,
  AlertCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Profile = {
  id: string;
  full_name: string | null;
  role: 'user' | 'admin' | string;
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getStatusLabel(status: string) {
  return statusLabel[status] || status;
}

function getStatusBadgeClass(status: string) {
  return statusBadgeClass[status] || 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50';
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = async () => {
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(profileError.message);
      }

      if (!profileData) {
        const { data: insertedProfile, error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email,
            role: 'user',
          })
          .select('id, full_name, role')
          .single();

        if (insertProfileError) {
          throw new Error(insertProfileError.message);
        }

        setProfile(insertedProfile);
      } else {
        setProfile(profileData);
      }

      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(
          'id, user_id, title, category, location, description, image_url, status, admin_note, created_at, updated_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reportError) {
        throw new Error(reportError.message);
      }

      setReports(reportData || []);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memuat dashboard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const baru = reports.filter((report) => report.status === 'baru').length;
    const diproses = reports.filter((report) => report.status === 'diproses').length;
    const selesai = reports.filter((report) => report.status === 'selesai').length;
    const ditolak = reports.filter((report) => report.status === 'ditolak').length;

    return {
      total,
      baru,
      diproses,
      selesai,
      ditolak,
    };
  }, [reports]);

  const latestReports = reports.slice(0, 5);
  const displayName = profile?.full_name || 'User';

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-40 animate-pulse rounded-3xl bg-white shadow-sm" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-3xl bg-white shadow-sm" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Welcome */}
        <div className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 p-6 shadow-xl shadow-blue-600/15 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Dashboard Pengaduan Publik
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Selamat Datang, {displayName}
              </h1>

              <p className="mt-3 max-w-xl text-base leading-relaxed text-blue-50">
                Kelola laporan pengaduan Anda, pantau status penanganan, dan lihat
                perkembangan tindak lanjut dari admin secara real-time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/dashboard/laporan-baru">
                <Button className="h-12 w-full rounded-2xl bg-white px-5 font-semibold text-blue-700 shadow-lg shadow-blue-950/10 hover:bg-blue-50 sm:w-auto lg:w-full">
                  <Plus className="mr-2 h-5 w-5" />
                  Buat Laporan Baru
                </Button>
              </Link>

              <Link href="/dashboard/laporan-saya">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-white/30 bg-white/10 px-5 font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-auto lg:w-full"
                >
                  Lihat Semua Laporan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Gagal memuat data dashboard</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDashboard}
              className="rounded-xl border-red-200 bg-white text-red-700 hover:bg-red-50"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Laporan</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                    {stats.total}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">Semua laporan yang Anda buat</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Baru / Diproses</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-amber-600">
                    {stats.baru + stats.diproses}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Clock3 className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">Menunggu atau sedang ditindaklanjuti</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Selesai</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-emerald-600">
                    {stats.selesai}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">Laporan sudah diselesaikan</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ditolak</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-red-600">
                    {stats.ditolak}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <XCircle className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">Laporan tidak dapat diproses</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Recent Reports */}
          <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight text-slate-950">
                  Laporan Terbaru
                </CardTitle>
                <CardDescription className="mt-1 text-slate-500">
                  Daftar laporan pengaduan terbaru yang Anda buat.
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadDashboard}
                  className="rounded-xl border-slate-200"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>

                <Link href="/dashboard/laporan-saya">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200"
                  >
                    Lihat Semua
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {latestReports.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                    <Inbox className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    Belum ada laporan
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                    Anda belum membuat laporan pengaduan. Buat laporan pertama
                    agar admin dapat mulai melakukan tindak lanjut.
                  </p>

                  <Link href="/dashboard/laporan-baru" className="mt-6">
                    <Button className="h-11 rounded-2xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Buat Laporan
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100">
                        <TableHead className="px-6 text-slate-500">Judul Laporan</TableHead>
                        <TableHead className="hidden px-6 text-slate-500 md:table-cell">
                          Lokasi
                        </TableHead>
                        <TableHead className="hidden px-6 text-slate-500 sm:table-cell">
                          Tanggal
                        </TableHead>
                        <TableHead className="px-6 text-slate-500">Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {latestReports.map((report) => (
                        <TableRow key={report.id} className="border-slate-100">
                          <TableCell className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-950">
                                {report.title}
                              </p>
                              <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                                {report.category}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400 sm:hidden">
                                <span>{formatDate(report.created_at)}</span>
                                <span>•</span>
                                <span>{report.location}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 md:table-cell">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{report.location}</span>
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
                              className={`rounded-full px-3 py-1 font-medium ${getStatusBadgeClass(
                                report.status
                              )}`}
                            >
                              {getStatusLabel(report.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm shadow-slate-200/70">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <UserRound className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  Ringkasan Akun
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Nama
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">{displayName}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Role
                    </p>
                    <p className="mt-1 font-semibold capitalize text-slate-950">
                      {profile?.role || 'user'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total Laporan
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {stats.total} laporan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-blue-100 bg-blue-600 text-white shadow-xl shadow-blue-600/15">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Butuh bantuan?</h3>

                <p className="mt-2 text-sm leading-relaxed text-blue-50">
                  Pastikan laporan dibuat dengan judul yang jelas, lokasi lengkap,
                  dan deskripsi kejadian agar admin lebih cepat memproses laporan.
                </p>

                <Link href="/dashboard/laporan-baru" className="mt-5 block">
                  <Button className="h-11 w-full rounded-2xl bg-white font-semibold text-blue-700 hover:bg-blue-50">
                    Buat Laporan Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}