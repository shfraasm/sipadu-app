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

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const getReadableError = (message: string) => {
    const lower = message.toLowerCase();

    if (
      lower.includes('invalid login credentials') ||
      lower.includes('invalid credentials')
    ) {
      return 'Email atau password salah. Silakan cek kembali.';
    }

    if (lower.includes('email not confirmed')) {
      return 'Email belum diverifikasi. Untuk demo tugas, matikan email confirmation di Supabase.';
    }

    if (lower.includes('too many requests') || lower.includes('rate limit')) {
      return 'Terlalu banyak percobaan login. Tunggu sebentar lalu coba lagi.';
    }

    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return 'Koneksi ke Supabase gagal. Cek internet atau konfigurasi Supabase.';
    }

    return message || 'Terjadi kesalahan saat login.';
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setErrorMessage('Email wajib diisi.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Format email tidak valid.');
      return false;
    }

    if (!formData.password) {
      setErrorMessage('Password wajib diisi.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const user = data.user;

      if (!user) {
        throw new Error('User tidak ditemukan setelah login.');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(profileError.message);
      }

      if (!profile) {
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email,
            role: 'user',
          });

        if (insertProfileError) {
          throw new Error(insertProfileError.message);
        }

        setSuccessMessage('Login berhasil. Mengalihkan ke dashboard...');

        setTimeout(() => {
          router.replace('/dashboard');
          router.refresh();
        }, 700);

        return;
      }

      setSuccessMessage('Login berhasil. Mengalihkan halaman...');

      setTimeout(() => {
        if (profile.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }

        router.refresh();
      }, 700);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(getReadableError(error.message));
      } else {
        setErrorMessage('Terjadi kesalahan saat login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left Side */}
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
                Masuk ke Akun
              </CardTitle>

              <CardDescription className="text-base leading-relaxed text-slate-500">
                Masukkan email dan password Anda untuk melanjutkan ke dashboard
                SIPADU.
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
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email
                  </Label>

                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />

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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>

                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
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
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="remember"
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                  >
                    <input
                      id="remember"
                      type="checkbox"
                      checked={formData.rememberMe}
                      disabled={isLoading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rememberMe: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                    Ingat saya
                  </label>

                  <Link
                    href="#"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  {isLoading ? (
                    'Memproses...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Masuk
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-7 text-center text-sm">
                <span className="text-slate-500">Belum punya akun? </span>
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Daftar sekarang
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mx-auto mt-7 max-w-sm text-center text-sm leading-relaxed text-slate-400">
            Dengan masuk, Anda dapat membuat laporan, memantau status, dan
            menerima tindak lanjut dari admin.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative hidden min-h-screen overflow-hidden bg-blue-50 lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100" />

        <div className="relative z-10 max-w-xl px-10 text-center">
          <div className="mb-12">
            <div className="relative mx-auto h-80 w-80">
              <div className="absolute inset-0 rounded-full bg-blue-100" />
              <div className="absolute inset-10 rounded-full bg-blue-200/70" />
              <div className="absolute inset-24 flex items-center justify-center rounded-full bg-white shadow-xl">
                <Shield className="h-20 w-20 text-blue-600" />
              </div>

              <div className="absolute right-6 top-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-400 text-2xl font-bold text-white shadow-xl">
                !
              </div>

              <div className="absolute bottom-16 left-6 h-14 w-14 rounded-full bg-emerald-400 shadow-xl" />
              <div className="absolute bottom-8 right-20 h-12 w-12 rounded-2xl bg-blue-500 shadow-xl" />
            </div>
          </div>

          <h2 className="mb-5 text-5xl font-bold leading-tight tracking-tight text-slate-950">
            Selamat Datang
            <br />
            Kembali
          </h2>

          <p className="mx-auto max-w-md text-lg leading-relaxed text-slate-600">
            Masuk untuk melihat laporan pengaduan Anda, memantau progres
            penanganan, dan mendapatkan update status secara real-time.
          </p>

          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-left">
            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">01</p>
              <p className="mt-2 text-sm text-slate-500">Buat laporan</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">02</p>
              <p className="mt-2 text-sm text-slate-500">Diproses admin</p>
            </div>

            <div className="rounded-3xl bg-white/80 p-5 shadow-md shadow-slate-200/70">
              <p className="text-xl font-bold text-blue-600">03</p>
              <p className="mt-2 text-sm text-slate-500">Pantau status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}