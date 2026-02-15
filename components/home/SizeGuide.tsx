'use client';

import { Ruler, Info } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import { kidsSizeChart, adultSizeChart } from '@/lib/data';

export default function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
            >
                <Ruler size={16} />
                Size Guide
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Bangle Size Guide">
                <div className="space-y-8">
                    {/* Instructions */}
                    <div className="bg-linear-to-br from-secondary/5 to-secondary/10 p-6 rounded-2xl border border-secondary/10">
                        <h3 className="text-lg font-display font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Info className="text-secondary" size={20} />
                            How to measure your bangle size
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-4">
                                <p className="text-neutral-600 leading-relaxed">
                                    To find your perfect bangle size, measure the <span className="text-secondary font-bold">inside diameter</span> of a bangle you already own.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                            <span className="text-secondary text-xs font-bold">1</span>
                                        </div>
                                        <p className="text-sm text-neutral-600">Place your bangle on a flat surface.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                            <span className="text-secondary text-xs font-bold">2</span>
                                        </div>
                                        <p className="text-sm text-neutral-600">Measure the distance across the inner circle through the center.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                            <span className="text-secondary text-xs font-bold">3</span>
                                        </div>
                                        <p className="text-sm text-neutral-600">Compare the cm measurement with the charts below.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-56 aspect-square bg-white rounded-2xl border border-neutral-100 flex items-center justify-center relative overflow-hidden p-6 shadow-sm">
                                {/* Visual representation of measuring diameter */}
                                <div className="w-40 h-40 rounded-full border-8 border-neutral-200 flex items-center justify-center relative">
                                    {/* The Bangle */}
                                    <div className="absolute inset-0 rounded-full border-4 border-secondary/30 ring-4 ring-secondary/10 ring-inset"></div>

                                    {/* The Ruler/Measurement line */}
                                    <div className="w-full h-0.5 bg-secondary relative flex justify-between items-center px-0.5">
                                        <div className="w-1 h-4 bg-secondary"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mb-1">
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-white px-2 whitespace-nowrap">Inner Diameter</span>
                                        </div>
                                        <div className="w-1 h-4 bg-secondary"></div>
                                    </div>

                                    {/* Dashed lines to edges */}
                                    <div className="absolute top-1/2 -left-1 w-1 h-1 bg-secondary rounded-full"></div>
                                    <div className="absolute top-1/2 -right-1 w-1 h-1 bg-secondary rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Kids Chart */}
                        <div>
                            <h4 className="text-md font-display font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">
                                Kids Chart
                            </h4>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-neutral-500 border-b border-neutral-100">
                                        <th className="text-left py-2 font-medium">Bangle Size</th>
                                        <th className="text-right py-2 font-medium">Inner Diameter</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {kidsSizeChart.map((item) => (
                                        <tr key={item.size} className="hover:bg-neutral-50 transition-colors">
                                            <td className="py-3 text-neutral-900 font-medium">{item.size}</td>
                                            <td className="py-3 text-neutral-600 text-right">{item.diameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Adult Chart */}
                        <div>
                            <h4 className="text-md font-display font-bold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">
                                Adult Size Chart
                            </h4>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-neutral-500 border-b border-neutral-100">
                                        <th className="text-left py-2 font-medium">Bangle Size</th>
                                        <th className="text-right py-2 font-medium">Inner Diameter</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {adultSizeChart.map((item) => (
                                        <tr key={item.size} className="hover:bg-neutral-50 transition-colors">
                                            <td className="py-3 text-neutral-900 font-medium">{item.size}</td>
                                            <td className="py-3 text-neutral-600 text-right">{item.diameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-xs text-neutral-400 text-center italic mt-4">
                        * All measurements are approximate. If you are between sizes, we recommend choosing the larger size.
                    </div>
                </div>
            </Modal>
        </div>
    );
}
