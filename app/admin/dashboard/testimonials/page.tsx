'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Plus, MessageSquareQuote, Loader2, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    location?: string;
    rating: number;
    text: string;
    image_url?: string;
    is_active: boolean;
    created_at: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        rating: 5,
        text: '',
        is_active: true,
    });

    const fetchTestimonials = async () => {
        try {
            // Fetch all testimonials (including inactive) for admin
            const res = await fetch('/api/testimonials');
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleOpenModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setFormData({
                name: testimonial.name,
                location: testimonial.location || '',
                rating: testimonial.rating,
                text: testimonial.text,
                is_active: testimonial.is_active,
            });
        } else {
            setEditingTestimonial(null);
            setFormData({
                name: '',
                location: '',
                rating: 5,
                text: '',
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
        setFormData({
            name: '',
            location: '',
            rating: 5,
            text: '',
            is_active: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = '/api/testimonials';
            const method = editingTestimonial ? 'PUT' : 'POST';
            const body = editingTestimonial
                ? { id: editingTestimonial.id, ...formData }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await fetchTestimonials();
                handleCloseModal();
            } else {
                alert('Failed to save testimonial');
            }
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const res = await fetch('/api/testimonials', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                await fetchTestimonials();
            } else {
                alert('Failed to delete testimonial');
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('An error occurred');
        }
    };

    const handleToggleActive = async (testimonial: Testimonial) => {
        try {
            const res = await fetch('/api/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: testimonial.id,
                    name: testimonial.name,
                    location: testimonial.location,
                    rating: testimonial.rating,
                    text: testimonial.text,
                    image_url: testimonial.image_url,
                    is_active: !testimonial.is_active,
                }),
            });

            if (res.ok) {
                await fetchTestimonials();
            }
        } catch (error) {
            console.error('Error toggling testimonial:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
                            Testimonials
                        </h1>
                        <p className="text-neutral-500 mt-1">
                            Manage customer reviews and testimonials
                        </p>
                    </div>
                    <Button onClick={() => handleOpenModal()} prefixIcon={<Plus size={18} />}>
                        Add Testimonial
                    </Button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center">
                        <MessageSquareQuote className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                        <h3 className="text-lg font-medium text-neutral-700 mb-2">No testimonials yet</h3>
                        <p className="text-neutral-500 mb-6">Add your first customer testimonial to display on the homepage.</p>
                        <Button onClick={() => handleOpenModal()} prefixIcon={<Plus size={18} />}>
                            Add Testimonial
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Review</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {testimonials.map((testimonial) => (
                                    <tr key={testimonial.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900">{testimonial.name}</div>
                                                    <div className="text-sm text-neutral-500">{testimonial.location || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-neutral-600 text-sm line-clamp-2 max-w-md">
                                                "{testimonial.text}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={14} className="text-amber-400" fill="#fbbf24" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(testimonial)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${testimonial.is_active
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {testimonial.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {testimonial.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(testimonial)}
                                                    className="p-2 text-neutral-500 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(testimonial.id)}
                                                    className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Customer Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Mumbai, Delhi"
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Rating
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={24}
                                            className={star <= formData.rating ? 'text-amber-400' : 'text-neutral-300'}
                                            fill={star <= formData.rating ? '#fbbf24' : 'none'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Review Text *
                            </label>
                            <textarea
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-secondary border-neutral-300 rounded focus:ring-secondary"
                            />
                            <label htmlFor="is_active" className="text-sm text-neutral-700">
                                Show on homepage
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : editingTestimonial ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </main>
        </div>
    );
}
