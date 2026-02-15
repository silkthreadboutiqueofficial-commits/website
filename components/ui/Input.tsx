'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    error?: string;
    regex?: RegExp; // Optional regex to validate/filter input
}

export default function Input({
    label,
    prefixIcon,
    suffixIcon,
    className = '',
    error,
    onChange,
    regex,
    ...props
}: InputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (regex && e.target.value && !regex.test(e.target.value)) {
            return; // Ignore input if it doesn't match the regex
        }
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-neutral-700">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                {prefixIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-secondary transition-colors pointer-events-none">
                        {prefixIcon}
                    </div>
                )}

                <input
                    {...props}
                    onChange={handleChange}
                    className={`
                        w-full bg-white rounded-xl border border-neutral-200 
                        py-3 text-sm text-neutral-900 placeholder:text-neutral-400
                        outline-none transition-all duration-200
                        focus:border-secondary focus:ring-4 focus:ring-secondary/10
                        disabled:bg-neutral-50 disabled:text-neutral-500
                        ${prefixIcon ? 'pl-10' : 'px-4'}
                        ${suffixIcon ? 'pr-10' : 'pr-4'}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
                    `}
                />

                {suffixIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                        {suffixIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
