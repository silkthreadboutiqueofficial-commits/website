'use client';

import Sidebar from '@/components/admin/Sidebar';
import { Search } from 'lucide-react';

export default function CustomersPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-display text-neutral-900">Customers</h1>
                    <p className="text-neutral-500 font-sans mt-1">View and manage your customer base.</p>
                </div>

                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-12 text-center">
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">No customers yet</h3>
                        <p className="text-neutral-500">Customers will appear here once you make your first sale.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
