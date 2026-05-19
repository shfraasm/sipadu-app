import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const recentReports = [
  {
    title: 'Jalan berlubang di Jl. Sudirman',
    status: 'Diproses',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60',
  },
  {
    title: 'Lampu penerangan jalan mati',
    status: 'Baru',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60',
  },
  {
    title: 'Sampah menumpuk di fasilitas umum',
    status: 'Selesai',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60',
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-10 dark:bg-slate-950 lg:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white/80 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <div className="grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_0.95fr] lg:p-12 xl:p-14">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Layanan Pengaduan Aktif 24/7
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                SIPADU
                <span className="mt-3 block text-3xl font-extrabold leading-tight text-blue-600 dark:text-blue-300 sm:text-4xl lg:text-5xl">
                  Sistem Pengaduan Pelayanan Publik
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500 dark:text-slate-400 sm:text-lg">
                Sampaikan keluhan, lampirkan bukti, dan pantau status laporan
                secara real-time melalui satu platform digital yang rapi, aman,
                dan mudah digunakan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/laporan-baru">
                  <Button className="h-14 w-full rounded-2xl bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 sm:w-auto">
                    <FileText className="mr-2 h-5 w-5" />
                    Buat Laporan
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-14 w-full rounded-2xl border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
                  >
                    Masuk Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-300">
                    <Users className="h-5 w-5" />
                    <span className="text-3xl font-bold">1.248</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total laporan masuk
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-3xl font-bold">892</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Laporan selesai
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-300">
                    <Clock3 className="h-5 w-5" />
                    <span className="text-3xl font-bold">2.5</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Hari rata-rata respon
                  </p>
                </div>
              </div>
            </div>

            {/* Right Dashboard Mockup */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Live Dashboard
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                      Dashboard Laporan
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Ringkasan status terkini
                    </p>
                  </div>

                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Laporan Baru
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-slate-950 dark:text-white">
                        12
                      </p>
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/40">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Diproses
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                        8
                      </p>
                      <Clock3 className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Selesai
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                        45
                      </p>
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/60 dark:bg-blue-950/40">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Bukti Terupload
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        96
                      </p>
                      <Upload className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-950 dark:text-white">
                      Laporan Terbaru
                    </p>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                      3 update
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div
                        key={report.title}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                            {report.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Diperbarui oleh admin
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${report.className}`}
                        >
                          {report.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/60 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>
                Dibuat untuk mempermudah proses pengaduan masyarakat secara
                digital.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Cepat
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Transparan
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Terpantau
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}