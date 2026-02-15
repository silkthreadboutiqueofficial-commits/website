'use client';

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// ============================================
// Table Types
// ============================================

export interface TableColumn<T> {
    key: string;
    header: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    emptyAction?: React.ReactNode;
    selectable?: boolean;
    selectedIds?: string[];
    onSelectChange?: (ids: string[]) => void;
    getRowId?: (row: T) => string;
    onRowClick?: (row: T) => void;
    stickyHeader?: boolean;
    compact?: boolean;
    className?: string;
    headerClassName?: string;
    rowClassName?: string | ((row: T, index: number) => string);
}

// ============================================
// Table Component
// ============================================

export function Table<T>({
    columns,
    data,
    isLoading = false,
    emptyMessage = 'No data found',
    emptyIcon,
    emptyAction,
    selectable = false,
    selectedIds = [],
    onSelectChange,
    getRowId = (row: any) => row.id,
    onRowClick,
    stickyHeader = false,
    compact = false,
    className = '',
    headerClassName = '',
    rowClassName = '',
}: TableProps<T>) {
    // Selection handlers
    const allSelected = data.length > 0 && data.every(row => selectedIds.includes(getRowId(row)));
    const someSelected = data.some(row => selectedIds.includes(getRowId(row)));

    const handleSelectAll = () => {
        if (!onSelectChange) return;
        if (allSelected) {
            onSelectChange([]);
        } else {
            onSelectChange(data.map(row => getRowId(row)));
        }
    };

    const handleSelectRow = (row: T, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onSelectChange) return;

        const id = getRowId(row);
        if (selectedIds.includes(id)) {
            onSelectChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectChange([...selectedIds, id]);
        }
    };

    const getRowClassName = (row: T, index: number): string => {
        if (typeof rowClassName === 'function') {
            return rowClassName(row, index);
        }
        return rowClassName;
    };

    // Padding based on compact mode
    const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4';
    const headerPadding = compact ? 'px-4 py-3' : 'px-6 py-4';

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
        );
    }

    // Empty state
    if (data.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                    {emptyIcon && <div className="mb-4 text-neutral-300">{emptyIcon}</div>}
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">{emptyMessage}</h3>
                    {emptyAction && <div className="mt-6">{emptyAction}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
                    <tr className={`bg-neutral-50/50 border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-500 ${headerClassName}`}>
                        {selectable && (
                            <th className={`${headerPadding} w-12`}>
                                <input
                                    type="checkbox"
                                    className="rounded border-neutral-300 text-secondary focus:ring-secondary cursor-pointer"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`${headerPadding} ${col.width || ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {data.map((row, index) => {
                        const rowId = getRowId(row);
                        const isSelected = selectedIds.includes(rowId);

                        return (
                            <tr
                                key={rowId}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={`hover:bg-neutral-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''} group ${isSelected ? 'bg-secondary/5' : ''} ${getRowClassName(row, index)}`}
                            >
                                {selectable && (
                                    <td className={cellPadding} onClick={(e) => handleSelectRow(row, e)}>
                                        <input
                                            type="checkbox"
                                            className="rounded border-neutral-300 text-secondary focus:ring-secondary cursor-pointer"
                                            checked={isSelected}
                                            onChange={() => { }}
                                        />
                                    </td>
                                )}
                                {columns.map((col) => {
                                    const value = (row as any)[col.key];
                                    return (
                                        <td
                                            key={col.key}
                                            className={`${cellPadding} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                                        >
                                            {col.render ? col.render(value, row, index) : (value ?? '—')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ============================================
// Table Helper Components
// ============================================

export function TableImageCell({ src, alt, fallback }: { src?: string | null; alt: string; fallback?: React.ReactNode }) {
    return (
        <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 relative">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                />
            ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-400">
                    {fallback || <div className="w-4 h-4 bg-neutral-300 rounded-full" />}
                </div>
            )}
        </div>
    );
}

export function TableBadge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' }) {
    const variants = {
        default: 'bg-neutral-100 text-neutral-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
        danger: 'bg-red-50 text-red-600',
        info: 'bg-blue-50 text-blue-600',
        secondary: 'bg-secondary/10 text-secondary',
    };

    return (
        <span className={`text-sm px-2 py-1 rounded-md font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
}

export function TableStatusBadge({ status }: { status: 'active' | 'inactive' | 'draft' | string }) {
    const statusConfig: Record<string, { bg: string; dot: string; text: string }> = {
        active: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-700' },
        inactive: { bg: 'bg-neutral-100', dot: 'bg-neutral-400', text: 'text-neutral-600' },
        draft: { bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-700' },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const label = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.bg} ${config.text} px-2.5 py-1 rounded-full`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {label}
        </span>
    );
}

export function TableActionButtons({
    onEdit,
    onDelete,
    showOnHover = true
}: {
    onEdit?: () => void;
    onDelete?: () => void;
    showOnHover?: boolean;
}) {
    return (
        <div className={`flex items-center gap-2 ${showOnHover ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
            {onEdit && (
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 text-neutral-400 hover:text-secondary hover:bg-secondary/5 rounded transition-colors"
                    title="Edit"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            )}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export function TableImagesPreview({ images, maxVisible = 3 }: { images: string[]; maxVisible?: number }) {
    if (!images || images.length === 0) {
        return <span className="text-neutral-300 italic text-xs">No images</span>;
    }

    const visibleImages = images.slice(0, maxVisible);
    const remaining = images.length - maxVisible;

    return (
        <div className="flex -space-x-2 overflow-hidden">
            {visibleImages.map((url, i) => (
                <div key={i} className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-neutral-100">
                    <Image
                        src={url.trim()}
                        alt={`Preview ${i + 1}`}
                        fill
                        sizes="32px"
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                    />
                </div>
            ))}
            {remaining > 0 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-neutral-100 text-[10px] font-medium text-neutral-500">
                    +{remaining}
                </div>
            )}
        </div>
    );
}

export default Table;
