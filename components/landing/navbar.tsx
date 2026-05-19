'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Menu,
  X,
  Shield,
  FileText,
  LogIn,
  Sparkles,
  HelpCircle,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  {
    label: 'Fitur',
    href: '/#fitur',
    icon: LayoutGrid,
  },
  {
    label: 'FAQ',
    href: '/#faq',
    icon: HelpCircle,
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
              <Shield className="h-6 w-6 text-white" />
            </div>

            <div>
              <span className="block text-xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white">
                SIPADU
              </span>
              <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Sistem Pengaduan Publik
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="mr-2 flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <ThemeToggle />

            <Link href="/login">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            </Link>

            <Link href="/dashboard/laporan-baru">
              <Button className="h-12 rounded-2xl bg-blue-600 px-5 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Buat Laporan
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-12 w-12 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="pb-5 md:hidden">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                Menu SIPADU
              </div>

              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-blue-600 dark:bg-slate-950 dark:text-blue-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-2xl border-slate-200 bg-white font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </Button>
                </Link>

                <Link
                  href="/dashboard/laporan-baru"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="h-12 w-full rounded-2xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Buat Laporan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}