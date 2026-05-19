'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getReadableError = (message: string) => {
    const lower = message.toLowerCase();

    if (
      lower.includes('already registered') ||
      lower.includes('user already registered') ||
      lower.includes('already been registered')
    ) {
      return 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.';
    }

    if (lower.includes('invalid email')) {
      return 'Format email tidak valid.';
    }

    if (lower.includes('password')) {
      return 'Password tidak memenuhi ketentuan. Gunakan minimal 8 karakter.';
    }

    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
    }

    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return 'Koneksi ke Supabase gagal. Cek internet atau konfigurasi Supabase.';
    }

    return message || 'Terjadi kesalahan saat membuat akun.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const cleanName = formData.name.trim();
      const cleanEmail = formData.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          data: {
            full_name: cleanName,
            role: 'user',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Kalau Supabase langsung membuat session, kita logout dulu
      // supaya user tetap masuk lewat halaman login.
      if (data.session) {
        await supabase.auth.signOut();
      }

      setSuccessMessage('Akun berhasil dibuat. Mengalihkan ke halaman login...');

      setTimeout(() => {
        router.replace('/login');
        router.refresh();
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(getReadableError(error.message));
      } else {
        setErrorMessage('Terjadi kesalahan saat membuat akun.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="relative hidden min-h-screen overflow-hidden bg-blue-50 lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100" />

        <div className="relative z-10 max-w-xl px-10 text-center">
          <div className="mb-12">
            <div className="relative mx-auto h-80 w-80">
              <div className="absolute inset-0 rounded-full bg-blue-100" />
              <div className="absolute inset-10 rounded-full bg-blue-200/70" />
              <div className="absolute inset-24 flex items-center justify-center rounded-full bg-white shadow-xl">
                <User className="h-20 w-20 text-blue-600" />
              </div>

              <div className="absolute left-6 top-10 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 text-2xl font-bold text-white shadow-xl">
                ✓
              </div>

              <div className="absolute right-8 top-16 h-12 w-12 rounded-full bg-amber-400 shadow-xl" />
              <div className="absolute bottom-10 right-20 h-12 w-12 rounded-2xl bg-blue-500 shadow-xl" />
            </div>
          </div>

          <h2 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-slate-950">
            Bergabung Bersama
            <br />
            SIPADU
          </h2>

          <p className="mx-auto max-w-md text-lg leading-relaxed text-slate-600">
            Buat akun untuk menyampaikan pengaduan pelayanan publik, memantau
            status laporan, dan menerima tindak lanjut dari admin.
          </p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-left">
            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">01</p>
              <p className="mt-2 text-sm text-slate-500">Daftar akun</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">02</p>
              <p className="mt-2 text-sm text-slate-500">Buat laporan</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">03</p>
              <p className="mt-2 text-sm text-slate-500">Pantau status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <Shield className="h-6 w-6 text-white" />
              </div>

              <div>
                <span className="block text-xl font-bold leading-tight tracking-tight text-slate-950">
                  SIPADU
                </span>
                <span className="block text-sm text-slate-500">
                  Sistem Pengaduan Pelayanan Publik
                </span>
              </div>
            </Link>
          </div>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
            <CardHeader className="space-y-3 px-7 pt-8">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-950">
                Buat Akun Baru
              </CardTitle>

              <CardDescription className="text-base leading-relaxed text-slate-500">
                Isi data berikut untuk mendaftar akun SIPADU dan mulai membuat
                laporan pengaduan.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 pb-8">
              {errorMessage && (
                <div className="mb-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Nama Lengkap
                  </Label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pr-4 text-base text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      style={{
                        paddingLeft: '48px',
                      }}
                    />
                  </div>

                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email
                  </Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pr-4 text-base text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      style={{
                        paddingLeft: '48px',
                      }}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      style={{
                        paddingLeft: '48px',
                        paddingRight: '48px',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Konfirmasi Password
                  </Label>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 text-base text-slate-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      style={{
                        paddingLeft: '48px',
                        paddingRight: '48px',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  {isLoading ? (
                    'Mendaftarkan akun...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Daftar
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-7 text-center text-sm">
                <span className="text-slate-500">Sudah punya akun? </span>
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Masuk di sini
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mx-auto mt-7 max-w-sm text-center text-sm leading-relaxed text-slate-400">
            Data akun digunakan untuk mengakses dashboard dan memantau laporan
            pengaduan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}