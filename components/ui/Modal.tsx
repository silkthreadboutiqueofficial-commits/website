'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white w-full max-w-90vw max-h-[90vh] rounded-2xl shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <h2 className="text-xl font-display font-semibold text-neutral-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
