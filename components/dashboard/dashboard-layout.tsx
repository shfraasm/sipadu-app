'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  LogOut,
  Shield,
  Menu,
  X,
  UserRound,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const menuItems = [
  {
    title: 'Dashboard',
    description: 'Ringkasan laporan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Buat Laporan',
    description: 'Kirim pengaduan baru',
    href: '/dashboard/laporan-baru',
    icon: FileText,
  },
  {
    title: 'Laporan Saya',
    description: 'Pantau status laporan',
    href: '/dashboard/laporan-saya',
    icon: FolderOpen,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      setIsCheckingUser(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/login');
        return;
      }

      setUserEmail(user.email || '');

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email || 'User',
          role: 'user',
        });
      }

      setIsCheckingUser(false);
    };

    loadUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    router.replace('/login');
    router.refresh();
  };

  const displayName = profile?.full_name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const isActiveMenu = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  };

  if (isCheckingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-200/70">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
          'fixed left-0 top-0 z-50 h-full w-[280px] border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <Shield className="h-6 w-6 text-white" />
              </div>

              <div>
                <span className="block text-xl font-bold leading-tight tracking-tight text-slate-950">
                  SIPADU
                </span>
                <span className="block text-xs text-slate-500">
                  Pelayanan Publik
                </span>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Card */}
          <div className="px-5 py-5">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-950">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                {profile?.role || 'user'}
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
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-blue-600'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p>{item.title}</p>
                    <p
                      className={cn(
                        'mt-0.5 truncate text-xs font-normal',
                        isActive ? 'text-blue-50' : 'text-slate-400'
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

          {/* Sidebar Bottom */}
          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
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
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              SIPADU Dashboard
            </p>
            <p className="truncate text-sm font-semibold text-slate-700">
              Sistem Pengaduan Pelayanan Publik
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="max-w-[140px] truncate text-sm font-bold text-slate-950">
                  {displayName}
                </p>
                <p className="max-w-[140px] truncate text-xs text-slate-500">
                  {userEmail}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden h-11 rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 md:inline-flex"
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