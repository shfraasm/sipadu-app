'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  X,
  Send,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Info,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'Infrastruktur Jalan',
  'Kebersihan Lingkungan',
  'Lampu Penerangan Jalan',
  'Drainase / Saluran Air',
  'Fasilitas Umum',
  'Pelayanan Administrasi',
  'Kesehatan',
  'Keamanan dan Ketertiban',
  'Transportasi Publik',
  'Lainnya',
];

export default function BuatLaporanPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/login');
        return;
      }

      setIsPageLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul laporan wajib diisi.';
    } else if (formData.title.trim().length < 8) {
      newErrors.title = 'Judul laporan minimal 8 karakter.';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori layanan wajib dipilih.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi kejadian wajib diisi.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi laporan wajib diisi.';
    } else if (formData.description.trim().length < 30) {
      newErrors.description = 'Deskripsi minimal 30 karakter agar laporan lebih jelas.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getReadableError = (message: string) => {
    const lower = message.toLowerCase();

    if (lower.includes('row-level security') || lower.includes('rls')) {
      return 'Data gagal disimpan karena policy RLS Supabase. Cek policy insert pada tabel reports.';
    }

    if (lower.includes('bucket not found') || lower.includes('storage')) {
      return 'Upload foto gagal. Pastikan bucket Supabase Storage bernama report-images sudah dibuat.';
    }

    if (lower.includes('jwt') || lower.includes('not authenticated')) {
      return 'Sesi login sudah habis. Silakan login ulang.';
    }

    return message || 'Terjadi kesalahan saat mengirim laporan.';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    }

    if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleSelectedFile = (selectedFile: File) => {
    setErrorMessage('');

    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar.');
      return;
    }

    const maxSize = 3 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setErrorMessage('Ukuran gambar maksimal 3MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleSelectedFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      handleSelectedFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl('');
  };

  const uploadImage = async (userId: string) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('report-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from('report-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const imageUrl = await uploadImage(user.id);

      const { error: insertError } = await supabase.from('reports').insert({
        user_id: user.id,
        title: formData.title.trim(),
        category: formData.category,
        location: formData.location.trim(),
        description: formData.description.trim(),
        image_url: imageUrl,
        status: 'baru',
        admin_note: null,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccessMessage('Laporan berhasil dikirim. Mengalihkan ke halaman laporan...');

      setTimeout(() => {
        router.replace('/dashboard/laporan-saya');
        router.refresh();
      }, 900);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(getReadableError(error.message));
      } else {
        setErrorMessage('Terjadi kesalahan saat mengirim laporan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-36 animate-pulse rounded-[32px] bg-white shadow-sm" />
          <div className="h-[520px] animate-pulse rounded-[32px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Buat Laporan Baru
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500">
              Isi detail pengaduan dengan jelas agar admin dapat memverifikasi
              dan menindaklanjuti laporan Anda lebih cepat.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span className="font-medium">Data laporan tersimpan aman</span>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main Form */}
          <Card className="rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <CardHeader className="border-b border-slate-100 px-7 py-7">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                Form Pengaduan
              </CardTitle>

              <CardDescription className="mt-2 text-base text-slate-500">
                Lengkapi informasi berikut sesuai kondisi di lapangan.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 py-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Judul */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Judul Laporan <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    id="title"
                    placeholder="Contoh: Jalan berlubang di Jl. Sudirman"
                    value={formData.title}
                    disabled={isLoading}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600"
                  />

                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Kategori Layanan <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    value={formData.category}
                    disabled={isLoading}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-600">
                      <SelectValue placeholder="Pilih kategori laporan" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Lokasi */}
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Lokasi Kejadian <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="location"
                      placeholder="Alamat lengkap lokasi kejadian"
                      value={formData.location}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600"
                      style={{
                        paddingLeft: '48px',
                      }}
                    />
                  </div>

                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Deskripsi Laporan <span className="text-red-500">*</span>
                  </Label>

                  <Textarea
                    id="description"
                    placeholder="Jelaskan kronologi, kondisi, dampak, dan informasi penting lainnya..."
                    value={formData.description}
                    disabled={isLoading}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-40 resize-none rounded-2xl border-slate-200 bg-slate-50 p-4 text-base text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600"
                  />

                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <p>Minimal 30 karakter. Semakin detail, semakin mudah ditindaklanjuti.</p>
                    <p>{formData.description.length}/500</p>
                  </div>

                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Upload Foto Bukti <span className="text-slate-400">(Opsional)</span>
                  </Label>

                  {!file ? (
                    <div
                      className={`relative rounded-[28px] border-2 border-dashed p-8 transition ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        disabled={isLoading}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      />

                      <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm">
                          <Upload className="h-8 w-8" />
                        </div>

                        <p className="mt-4 text-base font-semibold text-slate-950">
                          Drag & drop foto di sini
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          atau klik untuk memilih file. Format gambar, maksimal 3MB.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-200 sm:w-40">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Preview foto bukti"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-950">
                            {file.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            Foto ini akan diunggah sebagai bukti pendukung laporan.
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeFile}
                          disabled={isLoading}
                          className="rounded-2xl border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => router.back()}
                    className="h-14 flex-1 rounded-2xl border-slate-200 bg-white text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 flex-1 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        Kirim Laporan
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Info className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  Tips Laporan
                </h3>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-500">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">Gunakan judul jelas</p>
                    <p className="mt-1">Contoh: “Lampu jalan mati di depan kantor kelurahan”.</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">Tulis lokasi lengkap</p>
                    <p className="mt-1">Tambahkan nama jalan, RT/RW, atau patokan terdekat.</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">Lampirkan foto</p>
                    <p className="mt-1">Foto membantu admin memverifikasi kondisi lapangan.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-blue-100 bg-blue-600 text-white shadow-xl shadow-blue-600/15">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Status Awal Laporan</h3>

                <p className="mt-2 text-sm leading-relaxed text-blue-50">
                  Setelah dikirim, laporan otomatis masuk dengan status{' '}
                  <span className="font-bold text-white">Baru</span>. Admin akan
                  meninjau dan mengubah status menjadi Diproses, Selesai, atau Ditolak.
                </p>

                <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-blue-50">
                  Pastikan data yang dikirim sudah benar sebelum menekan tombol
                  Kirim Laporan.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}