import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mx-auto lg:mx-0 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              Layanan Aktif 24/7
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              SIPADU
              <span className="block text-primary">Sistem Pengaduan Pelayanan Publik</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              Sampaikan keluhan dan aspirasi Anda dengan mudah. Kami berkomitmen untuk merespons setiap laporan demi pelayanan publik yang lebih baik.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard/laporan-baru">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <FileText className="h-5 w-5" />
                  Buat Laporan
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t mt-4">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-2xl font-bold">1,248</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Laporan</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-600 dark:text-green-400 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-2xl font-bold">892</span>
                </div>
                <p className="text-sm text-muted-foreground">Laporan Selesai</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-bold">2.5</span>
                </div>
                <p className="text-sm text-muted-foreground">Hari Respon</p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative lg:pl-8">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Dashboard Card */}
              <div className="rounded-2xl border bg-card p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-card-foreground">Dashboard Laporan</h3>
                    <p className="text-sm text-muted-foreground">Status terkini</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Laporan Baru</p>
                  </div>
                  <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-4">
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">8</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">Diproses</p>
                  </div>
                  <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">45</p>
                    <p className="text-sm text-green-600 dark:text-green-500">Selesai</p>
                  </div>
                  <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4">
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">2</p>
                    <p className="text-sm text-red-600 dark:text-red-500">Ditolak</p>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Laporan Terbaru</p>
                  <div className="space-y-2">
                    {[
                      { title: 'Jalan berlubang di Jl. Sudirman', status: 'Diproses', color: 'bg-yellow-500' },
                      { title: 'Lampu jalan mati', status: 'Baru', color: 'bg-gray-400' },
                      { title: 'Sampah menumpuk', status: 'Selesai', color: 'bg-green-500' },
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <span className="text-sm font-medium text-foreground truncate max-w-[180px]">{report.title}</span>
                        <span className={`flex items-center gap-1.5 text-xs`}>
                          <span className={`h-2 w-2 rounded-full ${report.color}`} />
                          {report.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border bg-card p-4 shadow-lg hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Laporan Terkirim!</p>
                    <p className="text-xs text-muted-foreground">Akan segera diproses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
