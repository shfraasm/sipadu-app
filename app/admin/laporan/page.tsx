"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  Tag,
  UserRound,
  FileText,
  ArrowLeft,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  Save,
  ImageIcon,
  MessageSquareText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  status: "baru" | "diproses" | "selesai" | "ditolak" | string;
  admin_note: string | null;
  created_at: string;
  updated_at: string | null;
};

const statusLabel: Record<string, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

const statusBadgeClass: Record<string, string> = {
  baru: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  diproses:
    "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  selesai:
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  ditolak:
    "border-red-200 bg-red-50 text-red-700 hover:bg-red-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
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
    "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function AdminLaporanPage() {
  const router = useRouter();

  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const itemsPerPage = 8;

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      if (!profileData || profileData.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setAdminProfile(profileData);

      const { data: reportData, error: reportError } = await supabase
        .from("reports")
        .select(
          "id, user_id, title, category, location, description, image_url, status, admin_note, created_at, updated_at",
        )
        .order("created_at", { ascending: false });

      if (reportError) {
        throw new Error(reportError.message);
      }

      const allReports = reportData || [];
      setReports(allReports);

      const userIds = Array.from(
        new Set(allReports.map((report) => report.user_id)),
      );

      if (userIds.length > 0) {
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .in("id", userIds);

        const profileMap: Record<string, Profile> = {};

        (profileRows || []).forEach((profile) => {
          profileMap[profile.id] = profile;
        });

        setProfiles(profileMap);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat memuat laporan admin.");
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
      const reporterName =
        profiles[report.user_id]?.full_name?.toLowerCase() || "";

      const matchesSearch =
        report.title.toLowerCase().includes(keyword) ||
        report.category.toLowerCase().includes(keyword) ||
        report.location.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword) ||
        report.status.toLowerCase().includes(keyword) ||
        reporterName.includes(keyword);

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, profiles, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / itemsPerPage),
  );

  const paginatedReports = useMemo(() => {
    return filteredReports.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredReports, currentPage]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      baru: reports.filter((report) => report.status === "baru").length,
      diproses: reports.filter((report) => report.status === "diproses").length,
      selesai: reports.filter((report) => report.status === "selesai").length,
      ditolak: reports.filter((report) => report.status === "ditolak").length,
    };
  }, [reports]);

  const openDetail = (report: Report) => {
    setSelectedReport(report);
    setUpdateStatus(report.status);
    setAdminNote(report.admin_note || "");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const now = new Date().toISOString();

      const { error } = await supabase
        .from("reports")
        .update({
          status: updateStatus,
          admin_note: adminNote.trim() || null,
          updated_at: now,
        })
        .eq("id", selectedReport.id);

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
                updated_at: now,
              }
            : report,
        ),
      );

      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              status: updateStatus,
              admin_note: adminNote.trim() || null,
              updated_at: now,
            }
          : prev,
      );

      setSuccessMessage("Status dan catatan laporan berhasil diperbarui.");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat memperbarui laporan.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

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
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-36 animate-pulse rounded-[32px] bg-white shadow-sm dark:bg-slate-900" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-3xl bg-white shadow-sm dark:bg-slate-900"
              />
            ))}
          </div>
          <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-sm dark:bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Admin Dashboard
            </Link>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <ShieldCheck className="h-4 w-4" />
              Admin Control Center
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Kelola Semua Laporan
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Pantau seluruh laporan masyarakat, ubah status penanganan, dan
              tambahkan catatan tindak lanjut untuk user.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Login sebagai
            </p>
            <p className="mt-1 font-bold text-slate-950 dark:text-white">
              {adminProfile?.full_name || "Admin"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Laporan
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {stats.total}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Baru
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
                  {stats.baru}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Diproses
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-amber-600 dark:text-amber-300">
                  {stats.diproses}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                  <Clock3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Selesai
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-300">
                  {stats.selesai}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <CardHeader className="border-b border-slate-100 px-7 py-7 dark:border-slate-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Daftar Laporan Masuk
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Ditemukan {filteredReports.length} laporan dari total{" "}
                  {reports.length} laporan.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={loadReports}
                className="h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
                  placeholder="Cari judul, pelapor, kategori, lokasi..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  style={{ paddingLeft: "48px" }}
                />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
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

            <div className="overflow-hidden rounded-[24px] border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 bg-slate-50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-950">
                      <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        Laporan
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 md:table-cell">
                        Pelapor
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 lg:table-cell">
                        Lokasi
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 sm:table-cell">
                        Tanggal
                      </TableHead>
                      <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedReports.map((report) => {
                      const reporter = profiles[report.user_id];

                      return (
                        <TableRow
                          key={report.id}
                          className="border-slate-100 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                        >
                          <TableCell className="px-6 py-5">
                            <div className="max-w-[360px]">
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {report.title}
                              </p>
                              <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                                {report.category}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 md:table-cell">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <UserRound className="h-4 w-4" />
                              <span className="line-clamp-1">
                                {reporter?.full_name || "User"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 lg:table-cell">
                            <div className="flex max-w-[220px] items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="truncate">
                                {report.location}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden px-6 py-5 sm:table-cell">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(report.created_at)}
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-5">
                            <Badge
                              variant="outline"
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${getStatusBadgeClass(
                                report.status,
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
                              onClick={() => openDetail(report)}
                              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Halaman <span className="font-semibold">{currentPage}</span>{" "}
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
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900"
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
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900"
                >
                  Berikutnya
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
  open={!!selectedReport}
  onOpenChange={(open) => {
    if (!open) setSelectedReport(null);
  }}
>
  <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto rounded-3xl border-slate-200 p-0 dark:border-slate-800 dark:bg-slate-900">
    {selectedReport && (
      <>
        <DialogHeader className="border-b border-slate-100 px-6 py-6 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Update Laporan
              </DialogTitle>

              <DialogDescription className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Ubah status laporan dan tambahkan catatan admin untuk user.
              </DialogDescription>
            </div>

            <Badge
              variant="outline"
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusBadgeClass(
                selectedReport.status
              )}`}
            >
              {getStatusLabel(selectedReport.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 py-6">
          {/* Detail Laporan */}
          <section className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Judul Laporan
            </p>

            <h3 className="mt-2 break-words text-xl font-bold leading-snug text-slate-950 dark:text-white">
              {selectedReport.title}
            </h3>

            <div className="mt-5 rounded-2xl bg-white p-4 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Deskripsi
              </p>

              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                {selectedReport.description}
              </p>
            </div>
          </section>

          {/* Info Laporan */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">
              Informasi Laporan
            </h4>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex gap-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Tag className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Kategori
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
                    {selectedReport.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tanggal Dibuat
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
                    {formatDateTime(selectedReport.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <MapPin className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Lokasi
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
                    {selectedReport.location}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Foto Bukti */}
          {selectedReport.image_url ? (
            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Foto Bukti
                </p>
              </div>

              <img
                src={selectedReport.image_url}
                alt={selectedReport.title}
                className="max-h-[300px] w-full object-cover"
              />
            </section>
          ) : (
            <section className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <ImageIcon className="h-5 w-5 shrink-0" />
              Laporan ini tidak memiliki foto bukti.
            </section>
          )}

          {/* Update Admin */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-lg font-bold text-slate-950 dark:text-white">
              Tindak Lanjut Admin
            </h4>

            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Status dan catatan ini akan tampil di halaman Laporan Saya milik user.
            </p>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Status Laporan
                </label>

                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-white">
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Catatan Admin
                </label>

                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Contoh: Laporan sudah diteruskan ke dinas terkait dan sedang diproses."
                  className="min-h-32 resize-none rounded-2xl border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <div className="mb-2 flex items-center gap-2 font-bold">
                  <MessageSquareText className="h-4 w-4 shrink-0" />
                  Catatan ini terlihat oleh user
                </div>
                Setelah disimpan, user dapat melihat update status dan catatan
                admin di halaman Laporan Saya.
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
          </section>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}
