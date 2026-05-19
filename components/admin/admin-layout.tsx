'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Loader2,
  Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const menuItems = [
  {
    title: 'Dashboard',
    description: 'Ringkasan admin',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Semua Laporan',
    description: 'Kelola pengaduan',
    href: '/admin/laporan',
    icon: FileText,
  },
  {
    title: 'Pengguna',
    description: 'Kelola akun user',
    href: '/admin/users',
    icon: Users,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const loadAdmin = async () => {
      setIsCheckingAdmin(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      setAdminEmail(user.email || '');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        router.replace('/dashboard');
        return;
      }

      if (profileData.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setProfile(profileData);
      setIsCheckingAdmin(false);
    };

    loadAdmin();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    router.replace('/login');
    router.refresh();
  };

  const displayName = profile?.full_name || 'Admin SIPADU';
  const initial = displayName.charAt(0).toUpperCase();

  const isActiveMenu = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }

    return pathname.startsWith(href);
  };

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Memuat admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[280px] border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>

              <div>
                <span className="block text-xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white">
                  SIPADU
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Admin Panel
                </span>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Admin Card */}
          <div className="px-5 py-5">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {adminEmail}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-200">
                <Crown className="h-3.5 w-3.5" />
                Administrator
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive = isActiveMenu(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-blue-300'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p>{item.title}</p>
                    <p
                      className={cn(
                        'mt-0.5 truncate text-xs font-normal',
                        isActive
                          ? 'text-blue-50'
                          : 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
              </div>

              <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-[280px]">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Admin Dashboard
            </p>
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
              Sistem Pengaduan Pelayanan Publik
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="max-w-[150px] truncate text-sm font-bold text-slate-950 dark:text-white">
                  {displayName}
                </p>
                <p className="max-w-[150px] truncate text-xs text-slate-500 dark:text-slate-400">
                  {adminEmail}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 md:inline-flex"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Keluar
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}