import { FileText, Upload, Search, MessageSquare, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: FileText,
    title: 'Buat Laporan Online',
    description: 'Sampaikan keluhan Anda kapan saja dan di mana saja melalui form online yang mudah digunakan.',
  },
  {
    icon: Upload,
    title: 'Upload Bukti Foto',
    description: 'Lampirkan foto atau dokumen pendukung untuk memperkuat laporan Anda.',
  },
  {
    icon: Search,
    title: 'Tracking Status',
    description: 'Pantau perkembangan laporan Anda secara real-time dari status baru hingga selesai.',
  },
  {
    icon: MessageSquare,
    title: 'Respon Cepat Admin',
    description: 'Tim admin kami siap merespons dan menindaklanjuti setiap laporan yang masuk.',
  },
  {
    icon: Shield,
    title: 'Data Terjamin Aman',
    description: 'Informasi pribadi dan laporan Anda dilindungi dengan sistem keamanan terbaik.',
  },
  {
    icon: Clock,
    title: 'Layanan 24/7',
    description: 'Sistem kami beroperasi sepanjang waktu untuk menerima laporan dari masyarakat.',
  },
];

export function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            SIPADU hadir dengan berbagai fitur yang memudahkan masyarakat dalam menyampaikan pengaduan pelayanan publik.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
