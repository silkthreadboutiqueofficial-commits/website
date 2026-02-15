'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { Plus, Layers, Loader2, Pencil, Trash2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    images?: string[];
    products?: [{
        count: number;
    }];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                await fetchCategories();
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('An error occurred');
        }
    };

    const handleCreateCategory = async (data: any) => {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            await fetchCategories();
            handleCloseModal();
        } else {
            alert('Failed to create category');
        }
    };

    const handleUpdateCategory = async (data: any) => {
        if (!editingCategory) return;

        const res = await fetch('/api/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, id: editingCategory.id })
        });

        if (res.ok) {
            await fetchCategories();
            handleCloseModal();
        } else {
            alert('Failed to update category');
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await handleUpdateCategory(data);
            } else {
                await handleCreateCategory(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display text-neutral-900">Categories</h1>
                        <p className="text-neutral-500 font-sans mt-1">Organize your products into collections.</p>
                    </div>
                    <Button
                        size="md"
                        prefixIcon={<Plus size={18} />}
                        onClick={openCreateModal}
                    >
                        Add Category
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-neutral-400" size={32} />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No categories found</h3>
                            <p className="text-neutral-500 mb-6">Create categories to organize your inventory.</p>
                            <Button
                                variant="secondary"
                                size="md"
                                prefixIcon={<Plus size={18} />}
                                onClick={openCreateModal}
                            >
                                Add Category
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="p-2 bg-white text-neutral-500 hover:text-secondary border border-neutral-200 rounded-lg shadow-sm hover:bg-secondary/5 transition-all"
                                        title="Edit Category"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteCategory(category.id, e)}
                                        className="p-2 bg-white text-red-500 hover:text-red-600 border border-neutral-200 rounded-lg shadow-sm hover:bg-red-50 transition-all"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center text-secondary overflow-hidden flex-shrink-0 relative">
                                        {category.images && category.images.length > 0 ? (
                                            <Image
                                                src={category.images[0]}
                                                alt={category.name}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                                loading="lazy"
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                            />
                                        ) : (
                                            <Layers size={20} />
                                        )}
                                    </div>
                                    <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                                        /{category.slug}
                                    </span>
                                </div>
                                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-1">{category.name}</h3>
                                <p className="text-sm text-neutral-500 line-clamp-2 min-h-[2.5em] mb-4">
                                    {category.description || 'No description provided.'}
                                </p>
                                <div className="text-xs text-neutral-400 font-medium">
                                    {category.products?.[0]?.count || 0} Products
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingCategory ? "Edit Category" : "Add New Category"}
                >
                    <CategoryForm
                        onSubmit={handleSubmit}
                        onCancel={handleCloseModal}
                        isLoading={isSubmitting}
                        initialData={editingCategory}
                    />
                </Modal>
            </main>
        </div>
    );
}


