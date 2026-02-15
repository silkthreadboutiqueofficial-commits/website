import * as React from 'react';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Switch({ checked, onCheckedChange, disabled = false }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={`
                w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary/20
                ${checked ? 'bg-secondary' : 'bg-neutral-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <span
                className={`
                    block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out transform
                    ${checked ? 'translate-x-5' : 'translate-x-0.5'}
                    mt-0.5 ml-0
                `}
            />
        </button>
    );
}
