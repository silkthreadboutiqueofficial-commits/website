'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Plus, Search, Trash2, Loader2, Tag, Layers } from 'lucide-react';
import { Table, TableActionButtons } from '@/components/ui/Table';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductType {
    id: string;
    name: string;
    slug: string;
    category_id: string | null;
    category?: Category;
    created_at: string;
    products?: { count: number }[];
}

export default function ProductTypesPage() {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<ProductType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category_id: ''
    });

    // Fetch data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [typesRes, catsRes] = await Promise.all([
                fetch('/api/product-types'),
                fetch('/api/categories')
            ]);

            if (typesRes.ok) {
                const typesData = await typesRes.json();
                setProductTypes(typesData);
            }

            if (catsRes.ok) {
                const catsData = await catsRes.json();
                setCategories(catsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter product types
    const filteredTypes = productTypes.filter(type => {
        const matchesSearch = type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            type.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || type.category_id === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Open modal for create/edit
    const handleOpenModal = (type?: ProductType) => {
        if (type) {
            setEditingType(type);
            setFormData({
                name: type.name,
                category_id: type.category_id || ''
            });
        } else {
            setEditingType(null);
            setFormData({ name: '', category_id: '' });
        }
        setError('');
        setIsModalOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const url = editingType
                ? `/api/product-types/${editingType.id}`
                : '/api/product-types';

            const res = await fetch(url, {
                method: editingType ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.status === 409) {
                setError('A product type with this name already exists');
                return;
            }

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to save product type');
                return;
            }

            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving product type:', error);
            setError('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to delete ${ids.length} product type(s)?`)) return;

        try {
            const res = await fetch('/api/product-types', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to delete');
                return;
            }

            setSelectedTypes([]);
            await fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('An error occurred');
        }
    };



    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display text-neutral-900">Product Types</h1>
                        <p className="text-neutral-500 font-sans mt-1">
                            Manage product types like "Kada Bangles", "Jhumkha", etc.
                        </p>
                    </div>
                    <Button
                        size="md"
                        prefixIcon={<Plus size={18} />}
                        onClick={() => handleOpenModal()}
                    >
                        Add Type
                    </Button>
                </div>

                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search types..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/10 outline-none"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:border-secondary outline-none"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        {selectedTypes.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-neutral-600">{selectedTypes.length} selected</span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    prefixIcon={<Trash2 size={16} />}
                                    onClick={() => handleDelete(selectedTypes)}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-neutral-400" size={32} />
                        </div>
                    ) : filteredTypes.length === 0 ? (
                        <div className="p-12 text-center">
                            <Tag className="mx-auto mb-4 text-neutral-300" size={48} />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No product types found</h3>
                            <p className="text-neutral-500 mb-6">
                                {searchQuery || categoryFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Get started by creating your first product type'}
                            </p>
                            <Button
                                variant="secondary"
                                size="md"
                                prefixIcon={<Plus size={18} />}
                                onClick={() => handleOpenModal()}
                            >
                                Add Type
                            </Button>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    key: 'name',
                                    header: 'Name',
                                    render: (value, row) => (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                <Tag size={16} className="text-secondary" />
                                            </div>
                                            <span className="font-medium text-neutral-900">{value}</span>
                                        </div>
                                    )
                                },
                                {
                                    key: 'slug',
                                    header: 'Slug',
                                    render: (value) => (
                                        <code className="text-sm text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                                            {value}
                                        </code>
                                    )
                                },
                                {
                                    key: 'products',
                                    header: 'Products',
                                    render: (value, row) => (
                                        <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md">
                                            {row.products?.[0]?.count || 0} Products
                                        </span>
                                    )
                                },
                                {
                                    key: 'category',
                                    header: 'Category',
                                    render: (value) => value ? (
                                        <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md">
                                            {value.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-neutral-400">—</span>
                                    )
                                },
                                {
                                    key: 'actions',
                                    header: 'Actions',
                                    width: 'w-20',
                                    render: (_, row) => (
                                        <TableActionButtons
                                            onEdit={() => handleOpenModal(row)}
                                            onDelete={() => handleDelete([row.id])}
                                        />
                                    )
                                }
                            ]}
                            data={filteredTypes}
                            selectable
                            selectedIds={selectedTypes}
                            onSelectChange={setSelectedTypes}
                            getRowId={(row) => row.id}
                        />
                    )}
                </div>

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingType ? 'Edit Product Type' : 'Add Product Type'}
                >
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Type Name"
                            placeholder="e.g. Kada Bangles, Jhumkha"
                            required
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            prefixIcon={<Tag size={16} />}
                        />

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-neutral-700">
                                Category (Optional)
                            </label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                                <select
                                    className="w-full bg-white rounded-lg border border-neutral-200 pl-10 pr-4 py-2.5 text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all appearance-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">No Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                prefixIcon={isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            >
                                {isSaving ? 'Saving...' : (editingType ? 'Update' : 'Create')}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </main>
        </div>
    );
}
