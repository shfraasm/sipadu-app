'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  Users,
  Mail,
  CalendarDays,
  FileText,
  Crown,
  Eye,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  email: string | null;
  role: 'user' | 'admin' | string;
  created_at: string | null;
};

type ReportCount = Record<string, number>;

function formatDate(date?: string | null) {
  if (!date) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getInitial(name?: string | null, email?: string | null) {
  const source = name || email || 'U';
  return source.charAt(0).toUpperCase();
}

function getRoleBadgeClass(role: string) {
  if (role === 'admin') {
    return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300';
  }

  return 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300';
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [currentAdminId, setCurrentAdminId] = useState('');
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);

  const [users, setUsers] = useState<Profile[]>([]);
  const [reportCounts, setReportCounts] = useState<ReportCount>({});

  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('user');

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const itemsPerPage = 8;

  const loadUsers = useCallback(async () => {
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

      setCurrentAdminId(user.id);

      const { data: currentProfile, error: currentProfileError } =
        await supabase
          .from('profiles')
          .select('id, full_name, email, role, created_at')
          .eq('id', user.id)
          .single();

      if (currentProfileError) {
        throw new Error(currentProfileError.message);
      }

      if (!currentProfile || currentProfile.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setAdminProfile(currentProfile);

      const { data: profileRows, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      setUsers(profileRows || []);

      const { data: reportRows } = await supabase
        .from('reports')
        .select('id, user_id');

      const counts: ReportCount = {};

      (reportRows || []).forEach((report) => {
        counts[report.user_id] = (counts[report.user_id] || 0) + 1;
      });

      setReportCounts(counts);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memuat data user.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = searchQuery.toLowerCase();

      const matchesSearch =
        (user.full_name || '').toLowerCase().includes(keyword) ||
        (user.email || '').toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword) ||
        user.id.toLowerCase().includes(keyword);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredUsers, currentPage]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((user) => user.role === 'admin').length,
      user: users.filter((user) => user.role === 'user').length,
      withReports: users.filter((user) => (reportCounts[user.id] || 0) > 0)
        .length,
    };
  }, [users, reportCounts]);

  const openDetail = (user: Profile) => {
    setSelectedUser(user);
    setEditName(user.full_name || '');
    setEditRole(user.role || 'user');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (selectedUser.id === currentAdminId && editRole !== 'admin') {
        throw new Error(
          'Akun admin yang sedang login tidak boleh diubah menjadi user biasa.'
        );
      }

      if (!editName.trim()) {
        throw new Error('Nama user tidak boleh kosong.');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editName.trim(),
          role: editRole,
        })
        .eq('id', selectedUser.id);

      if (error) {
        throw new Error(error.message);
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                full_name: editName.trim(),
                role: editRole,
              }
            : user
        )
      );

      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              full_name: editName.trim(),
              role: editRole,
            }
          : prev
      );

      setSuccessMessage('Data user berhasil diperbarui.');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memperbarui user.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
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
              User Management
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Kelola User SIPADU
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Pantau akun user, lihat jumlah laporan, dan atur role akses antara
              user biasa dan admin.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Login sebagai
            </p>
            <p className="mt-1 font-bold text-slate-950 dark:text-white">
              {adminProfile?.full_name || 'Admin'}
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
                Total User
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {stats.total}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Admin
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
                  {stats.admin}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Crown className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                User Biasa
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-300">
                  {stats.user}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <UserRound className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Pernah Melapor
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-4xl font-bold tracking-tight text-amber-600 dark:text-amber-300">
                  {stats.withReports}
                </p>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                  <FileText className="h-6 w-6" />
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
                  Daftar User
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-500 dark:text-slate-400">
                  Ditemukan {filteredUsers.length} user dari total {users.length}{' '}
                  akun.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={loadUsers}
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
                  placeholder="Cari nama, email, role, atau user ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  style={{ paddingLeft: '48px' }}
                />
              </div>

              <Select value={roleFilter} onValueChange={handleRoleChange}>
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-slate-400" />
                    <SelectValue placeholder="Filter role" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 bg-slate-50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-950">
                      <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        User
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        Role
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 sm:table-cell">
                        Laporan
                      </TableHead>
                      <TableHead className="hidden px-6 py-4 text-slate-500 dark:text-slate-400 lg:table-cell">
                        Terdaftar
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-slate-100 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      >
                        <TableCell className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                              {getInitial(user.full_name, user.email)}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-950 dark:text-white">
                                {user.full_name || 'Tanpa Nama'}
                              </p>
                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                {user.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden px-6 py-5 md:table-cell">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Mail className="h-4 w-4" />
                            {user.email || '-'}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 font-semibold capitalize ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {user.role === 'admin' && (
                              <Crown className="mr-1 h-3.5 w-3.5" />
                            )}
                            {user.role}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden px-6 py-5 sm:table-cell">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {reportCounts[user.id] || 0}
                          </div>
                        </TableCell>

                        <TableCell className="hidden px-6 py-5 lg:table-cell">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>

                        <TableCell className="px-6 py-5 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openDetail(user)}
                            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Halaman <span className="font-semibold">{currentPage}</span> dari{' '}
                <span className="font-semibold">{totalPages}</span>
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
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent className="max-w-xl rounded-[28px] border-slate-200 p-0 dark:border-slate-800 dark:bg-slate-900">
          {selectedUser && (
            <>
              <DialogHeader className="border-b border-slate-100 px-7 py-6 dark:border-slate-800">
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Detail User
                </DialogTitle>
                <DialogDescription className="mt-1 text-slate-500 dark:text-slate-400">
                  Edit nama user dan role akses akun.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 px-7 py-6">
                <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                    {getInitial(selectedUser.full_name, selectedUser.email)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-950 dark:text-white">
                      {selectedUser.full_name || 'Tanpa Nama'}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {selectedUser.email || '-'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      ID: {selectedUser.id}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Jumlah Laporan
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                      {reportCounts[selectedUser.id] || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Tanggal Daftar
                    </p>
                    <p className="mt-2 font-bold text-slate-950 dark:text-white">
                      {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Nama Lengkap
                  </Label>

                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Role Akses
                  </Label>

                  <Select value={editRole} onValueChange={setEditRole}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedUser.id === currentAdminId && (
                    <p className="text-sm text-amber-600 dark:text-amber-300">
                      Akun admin yang sedang login tidak bisa diturunkan menjadi
                      user biasa.
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleUpdateUser}
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
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}