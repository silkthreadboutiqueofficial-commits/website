'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (e: { target: { value: string } }) => void;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    size = 'md',
    className = '',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange?.({ target: { value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between gap-2 w-full
                    bg-white border border-neutral-200 rounded-lg
                    hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary
                    transition-all cursor-pointer
                    ${sizes[size]}
                `}
            >
                <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    size={iconSizes[size]}
                    className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`
                    absolute z-50 top-full left-0 right-0 mt-1
                    bg-white rounded-xl shadow-xl border border-neutral-100
                    py-1 max-h-64 overflow-y-auto
                    transition-all duration-200 origin-top
                    ${isOpen
                        ? 'opacity-100 visible scale-100 translate-y-0'
                        : 'opacity-0 invisible scale-95 -translate-y-2'
                    }
                `}
            >
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`
                            w-full flex items-center justify-between px-4 py-2.5 text-left text-sm
                            transition-colors hover:bg-secondary/10
                            ${option.value === value ? 'text-secondary font-medium bg-secondary/5' : 'text-neutral-700'}
                        `}
                    >
                        {option.label}
                        {option.value === value && (
                            <Check size={14} className="text-secondary" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export type { SelectOption, SelectProps };
