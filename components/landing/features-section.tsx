import {
  FileText,
  Upload,
  Search,
  MessageSquare,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Buat Laporan Online',
    description:
      'Sampaikan keluhan kapan saja melalui form pengaduan online yang sederhana, cepat, dan mudah digunakan.',
  },
  {
    icon: Upload,
    title: 'Upload Bukti Foto',
    description:
      'Lampirkan foto pendukung agar laporan lebih jelas dan proses verifikasi dapat dilakukan lebih cepat.',
  },
  {
    icon: Search,
    title: 'Tracking Status',
    description:
      'Pantau perkembangan laporan secara real-time, mulai dari status baru, diproses, selesai, hingga ditolak.',
  },
  {
    icon: MessageSquare,
    title: 'Catatan Admin',
    description:
      'Setiap laporan dapat diberi catatan tindak lanjut oleh admin sehingga pelapor tahu progres penanganannya.',
  },
  {
    icon: Shield,
    title: 'Data Terjamin Aman',
    description:
      'Informasi akun dan laporan pengguna tersimpan dengan aman di sistem dan hanya digunakan untuk tindak lanjut.',
  },
  {
    icon: Clock,
    title: 'Akses Kapan Saja',
    description:
      'Sistem dapat digunakan kapan saja untuk membuat laporan baru maupun memantau status laporan yang sudah dikirim.',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="fitur"
      className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-950"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -left-28 bottom-10 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            Fitur Utama SIPADU
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Fitur Unggulan untuk
            <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Pengaduan Publik Digital
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
            SIPADU membantu masyarakat membuat laporan, melampirkan bukti,
            memantau status, dan menerima tindak lanjut dari admin dalam satu
            platform yang rapi dan mudah digunakan.
          </p>
        </div>

        {/* Main Feature Layout */}
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_1.9fr]">
          {/* Highlight Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-600 to-sky-500 p-7 text-white shadow-xl shadow-blue-600/20 dark:border-blue-900/60">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-12 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Shield className="h-7 w-7" />
              </div>

              <h3 className="mt-8 text-3xl font-bold tracking-tight">
                Sistem pengaduan yang lebih transparan.
              </h3>

              <p className="mt-4 text-sm leading-7 text-blue-50">
                Setiap laporan memiliki alur yang jelas: dibuat oleh user,
                masuk ke dashboard admin, diperbarui statusnya, lalu dapat
                dipantau kembali oleh pelapor.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                    01
                  </div>
                  <div>
                    <p className="font-bold">User membuat laporan</p>
                    <p className="text-sm text-blue-50">
                      Lengkap dengan kategori, lokasi, dan foto bukti.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                    02
                  </div>
                  <div>
                    <p className="font-bold">Admin menindaklanjuti</p>
                    <p className="text-sm text-blue-50">
                      Status dan catatan admin langsung tersimpan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600">
                    03
                  </div>
                  <div>
                    <p className="font-bold">User memantau progres</p>
                    <p className="text-sm text-blue-50">
                      Perubahan status tampil di halaman Laporan Saya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-blue-900/70 dark:hover:shadow-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-300 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fitur {String(index + 1).padStart(2, '0')}
                    </p>

                    <h3 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              24/7
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Sistem dapat menerima laporan kapan saja.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              Real-time
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Status laporan bisa dipantau langsung oleh user.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              Admin
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Setiap laporan dapat diberi status dan catatan tindak lanjut.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}