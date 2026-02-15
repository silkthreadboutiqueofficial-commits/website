import React from 'react';

type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisible?: number; // total buttons to show including first & last
};

export default function Pagination({ currentPage, totalPages, onPageChange, maxVisible = 4 }: Props) {
    if (totalPages <= 1) return null;

    const buildItems = () => {
        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const items: (number | '...')[] = [];
        const visibleMiddle = maxVisible - 2; // excluding first and last
        let start = currentPage - Math.floor(visibleMiddle / 2);
        let end = currentPage + Math.floor(visibleMiddle / 2);

        if (start < 2) {
            start = 2;
            end = start + visibleMiddle - 1;
        }
        if (end > totalPages - 1) {
            end = totalPages - 1;
            start = end - (visibleMiddle - 1);
        }

        items.push(1);
        if (start > 2) items.push('...');

        for (let p = start; p <= end; p++) items.push(p);

        if (end < totalPages - 1) items.push('...');
        items.push(totalPages);

        return items;
    };

    const items = buildItems();

    return (
        // full-width container so the inner row can scroll on small screens without causing page overflow
        <div className="w-full mt-8">
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {/* scrollable row to prevent horizontal page overflow on small screens */}
                <div
                    className="flex-1 max-w-full overflow-x-auto px-2"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="inline-flex items-center gap-1 whitespace-nowrap">
                        {items.map((it, idx) => (
                            typeof it === 'number' ? (
                                <button
                                    key={it}
                                    onClick={() => onPageChange(it)}
                                    className={`min-w-10 w-10 h-10 rounded-lg text-sm font-medium ${currentPage === it ? 'bg-secondary text-white' : 'border border-neutral-200 hover:bg-neutral-100'}`}
                                    aria-current={currentPage === it ? 'page' : undefined}
                                >
                                    {it}
                                </button>
                            ) : (
                                <span key={`sep-${idx}`} className="px-2 text-neutral-400">{it}</span>
                            )
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
