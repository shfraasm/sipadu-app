import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  MessageCircleQuestion,
  ShieldCheck,
  Clock3,
  UserCheck,
  SearchCheck,
} from 'lucide-react';

const faqs = [
  {
    question: 'Bagaimana cara membuat laporan pengaduan?',
    answer:
      'Anda dapat membuat laporan dengan mengklik tombol "Buat Laporan", lalu mengisi form yang tersedia dengan lengkap. Pastikan untuk menyertakan deskripsi yang jelas dan lokasi kejadian.',
  },
  {
    question: 'Apakah saya perlu membuat akun untuk melapor?',
    answer:
      'Ya, Anda perlu mendaftar dan login terlebih dahulu untuk membuat laporan. Hal ini diperlukan agar kami dapat menghubungi Anda terkait perkembangan laporan.',
  },
  {
    question: 'Berapa lama waktu respon untuk laporan saya?',
    answer:
      'Rata-rata waktu respon kami adalah 2-3 hari kerja. Namun, untuk kasus mendesak akan diprioritaskan dan ditangani lebih cepat.',
  },
  {
    question: 'Apakah identitas pelapor dirahasiakan?',
    answer:
      'Ya, identitas pelapor dijaga kerahasiaannya. Informasi pribadi Anda tidak akan dipublikasikan dan hanya digunakan untuk keperluan tindak lanjut laporan.',
  },
  {
    question: 'Bagaimana cara memantau status laporan?',
    answer:
      'Setelah login, Anda dapat melihat status laporan di menu "Laporan Saya". Setiap perubahan status akan terlihat secara real-time.',
  },
  {
    question: 'Apa saja kategori laporan yang dapat disampaikan?',
    answer:
      'Anda dapat melaporkan berbagai hal seperti infrastruktur jalan, kebersihan lingkungan, pelayanan kesehatan, pendidikan, administrasi kependudukan, keamanan, dan transportasi publik.',
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Aman',
    description: 'Identitas pelapor tetap terlindungi.',
  },
  {
    icon: Clock3,
    title: 'Terpantau',
    description: 'Status laporan dapat dicek kapan saja.',
  },
  {
    icon: UserCheck,
    title: 'Terhubung',
    description: 'Admin dapat memberi catatan tindak lanjut.',
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-slate-50 py-24 dark:bg-slate-950"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -left-24 top-32 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <MessageCircleQuestion className="h-4 w-4" />
            FAQ SIPADU
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Pertanyaan yang Sering
            <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Diajukan
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
            Temukan jawaban seputar cara membuat laporan, memantau status
            pengaduan, hingga keamanan data pelapor di SIPADU.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="mx-auto mb-10 grid max-w-5xl gap-4 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ Content */}
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left Info Card */}
          <div className="h-fit rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-600 to-sky-500 p-7 text-white shadow-xl shadow-blue-600/20 dark:border-blue-900/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <HelpCircle className="h-7 w-7" />
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight">
              Masih punya pertanyaan?
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-blue-50">
              Jika jawaban yang Anda cari belum tersedia, Anda tetap dapat
              membuat laporan atau menghubungi admin melalui sistem SIPADU.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-blue-50">
              <div className="mb-2 flex items-center gap-2 font-bold text-white">
                <SearchCheck className="h-4 w-4" />
                Tips sebelum melapor
              </div>
              Pastikan laporan memiliki lokasi jelas, deskripsi lengkap, dan
              bukti foto jika tersedia agar proses verifikasi lebih cepat.
            </div>
          </div>

          {/* Accordion */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 px-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <AccordionTrigger className="gap-4 py-5 text-left text-base font-bold text-slate-950 hover:no-underline dark:text-white">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="flex-1">{faq.question}</span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5 pl-12 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}