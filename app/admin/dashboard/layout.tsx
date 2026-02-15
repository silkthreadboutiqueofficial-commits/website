'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (!response.ok) {
                    router.push('/admin/login');
                } else {
                    setLoading(false);
                }
            } catch {
                router.push('/admin/login');
            }
        };
        checkSession();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="animate-pulse text-neutral-400">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}
