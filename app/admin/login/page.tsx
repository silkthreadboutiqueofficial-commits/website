'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Lock, Mail } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    router.replace('/admin/dashboard');
                }
            } catch { }
        };
        checkSession();
    }, [router]);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <div className="relative h-16 w-48">
                        <Image
                            src="/logo/black-hoz-removebg-preview.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-display text-white text-center mb-2">Admin Access</h1>
                <p className="text-neutral-400 text-center mb-8 font-sans text-sm">Sign in to manage your boutique</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-neutral-600 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-neutral-700"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-neutral-600 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white pl-10 pr-4 py-3 rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-neutral-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
