import { ReactNode } from 'react';

export type BadgeVariant = 'ribbon' | 'discount' | 'new' | 'sale' | 'custom';

interface BadgeProps {
    variant: BadgeVariant;
    children: ReactNode;
    className?: string;
}

// Direct color classes for reliability (CSS variables can have issues with Tailwind JIT)
const variantStyles: Record<BadgeVariant, string> = {
    ribbon: 'bg-secondary text-white',
    discount: 'bg-red-500 text-white',
    new: 'bg-emerald-500 text-white',
    sale: 'bg-orange-500 text-white',
    custom: '',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
    return (
        <span
            className={`
                inline-flex items-center justify-center
                px-2.5 py-1 
                text-xs font-bold 
                rounded-full 
                shadow-lg
                ${variantStyles[variant]}
                ${className}
            `}
        >
            {children}
        </span>
    );
}

// Convenience components for common use cases
export function RibbonBadge({ children, className }: { children: ReactNode; className?: string }) {
    return <Badge variant="ribbon" className={className}>{children}</Badge>;
}

export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
    return <Badge variant="discount" className={className}>-{percent}%</Badge>;
}

export function NewBadge({ className }: { className?: string }) {
    return <Badge variant="new" className={className}>New</Badge>;
}

export function SaleBadge({ className }: { className?: string }) {
    return <Badge variant="sale" className={className}>Sale</Badge>;
}
