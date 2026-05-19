import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Bagaimana cara membuat laporan pengaduan?',
    answer: 'Anda dapat membuat laporan dengan mengklik tombol "Buat Laporan", lalu mengisi form yang tersedia dengan lengkap. Pastikan untuk menyertakan deskripsi yang jelas dan lokasi kejadian.',
  },
  {
    question: 'Apakah saya perlu membuat akun untuk melapor?',
    answer: 'Ya, Anda perlu mendaftar dan login terlebih dahulu untuk membuat laporan. Hal ini diperlukan agar kami dapat menghubungi Anda terkait perkembangan laporan.',
  },
  {
    question: 'Berapa lama waktu respon untuk laporan saya?',
    answer: 'Rata-rata waktu respon kami adalah 2-3 hari kerja. Namun, untuk kasus mendesak akan diprioritaskan dan ditangani lebih cepat.',
  },
  {
    question: 'Apakah identitas pelapor dirahasiakan?',
    answer: 'Ya, identitas pelapor dijaga kerahasiaannya. Informasi pribadi Anda tidak akan dipublikasikan dan hanya digunakan untuk keperluan tindak lanjut laporan.',
  },
  {
    question: 'Bagaimana cara memantau status laporan?',
    answer: 'Setelah login, Anda dapat melihat status laporan di menu "Laporan Saya". Setiap perubahan status akan terlihat secara real-time.',
  },
  {
    question: 'Apa saja kategori laporan yang dapat disampaikan?',
    answer: 'Anda dapat melaporkan berbagai hal seperti infrastruktur jalan, kebersihan lingkungan, pelayanan kesehatan, pendidikan, administrasi kependudukan, keamanan, dan transportasi publik.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan SIPADU.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
