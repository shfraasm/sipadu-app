import Link from 'next/link';
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  FileText,
  LogIn,
  UserPlus,
  HelpCircle,
} from 'lucide-react';

const quickLinks = [
  {
    label: 'Beranda',
    href: '/',
  },
  {
    label: 'Fitur',
    href: '/#fitur',
  },
  {
    label: 'FAQ',
    href: '/#faq',
  },
  {
    label: 'Masuk',
    href: '/login',
  },
];

const services = [
  {
    label: 'Buat Laporan',
    href: '/dashboard/laporan-baru',
    icon: FileText,
  },
  {
    label: 'Cek Status Laporan',
    href: '/dashboard/laporan-saya',
    icon: HelpCircle,
  },
  {
    label: 'Daftar Akun',
    href: '/register',
    icon: UserPlus,
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* CTA Card */}
        <div className="mb-10 overflow-hidden rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 p-6 text-white shadow-xl shadow-blue-600/20 dark:border-blue-900/60 sm:p-8">
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Layanan Pengaduan Digital
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Punya keluhan pelayanan publik?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-50 sm:text-base">
                Buat laporan secara online, lampirkan bukti, dan pantau status
                tindak lanjut langsung dari dashboard SIPADU.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/laporan-baru">
                <div className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/10 transition hover:bg-blue-50 sm:w-auto">
                  Buat Laporan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>

              <Link href="/login">
                <div className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto">
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr]">
          {/* Brand */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <Shield className="h-6 w-6 text-white" />
              </div>

              <div>
                <span className="block text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  SIPADU
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Sistem Pengaduan Pelayanan Publik
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Platform pengaduan pelayanan publik yang membantu masyarakat
              menyampaikan laporan, memantau status, dan menerima tindak lanjut
              secara lebih mudah dan transparan.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                Aman
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Transparan
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Terpantau
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-white">
              Tautan Cepat
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition group-hover:bg-blue-600 dark:bg-slate-700 dark:group-hover:bg-blue-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-white">
              Layanan
            </h3>

            <div className="mt-5 space-y-3">
              {services.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900/70 dark:hover:bg-blue-950/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-900 dark:text-blue-300 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-semibold text-slate-600 transition group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-300">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-white">
              Kontak
            </h3>

            <ul className="mt-5 space-y-4">
              <li className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Email
                  </p>
                  <p className="mt-1">info@sipadu.go.id</p>
                </div>
              </li>

              <li className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Telepon
                  </p>
                  <p className="mt-1">(021) 1500-123</p>
                </div>
              </li>

              <li className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Alamat
                  </p>
                  <p className="mt-1 leading-6">
                    Jl. Medan Merdeka Barat No. 1, Jakarta Pusat 10110
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} SIPADU. Hak Cipta Dilindungi.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="transition hover:text-blue-600 dark:hover:text-blue-300">
              Masuk
            </Link>
            <Link href="/register" className="transition hover:text-blue-600 dark:hover:text-blue-300">
              Daftar
            </Link>
            <Link href="/#faq" className="transition hover:text-blue-600 dark:hover:text-blue-300">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}