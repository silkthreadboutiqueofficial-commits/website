'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/admin/products/ProductForm';
import { Plus, Search, Filter, Edit, Trash2, Loader2, Upload, FileUp, CheckCircle, XCircle, AlertTriangle, Layers } from 'lucide-react';
import Papa from 'papaparse';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductType {
    id: string;
    name: string;
    slug: string;
    category_id?: string;
}

interface Product {
    id: string;
    name: string;
    subtitle?: string;
    ribbon?: string;
    description?: string;
    category_id: string;
    type_id?: string;
    product_title?: string;
    mrp_price: number;
    offer_price?: number;
    images: string[];
    options?: any;
    status: string;
    created_at: string;
    category?: Category;
    product_type?: ProductType;
}

export default function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [saveError, setSaveError] = useState('');

    // Import State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importStep, setImportStep] = useState<'instructions' | 'preview' | 'importing' | 'complete'>('instructions');
    const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0, success: 0, failed: 0, duplicates: 0, skipped: 0 });
    const [importLogs, setImportLogs] = useState<{ message: string; type: 'success' | 'error' | 'duplicate' | 'skipped' }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // CSV Column Definitions
    const CSV_COLUMNS = {
        required: [
            { key: 'name', label: 'Name', example: 'Kada Bangles Set', description: 'Product name' },
            { key: 'category', label: 'Category', example: 'Bangles', description: 'Category name (auto-created if not found)' },
            { key: 'type', label: 'Type', example: 'Kada Bangles', description: 'Product type (auto-created if not found)' },
            { key: 'mrp price', label: 'MRP Price', example: '500', description: 'Maximum retail price' },
        ],
        optional: [
            { key: 'title', label: 'Title', example: 'Silk Thread', description: 'Material/brand (default: Silk Thread)' },
            { key: 'offer price', label: 'Offer Price', example: '400', description: 'Discounted price' },
            { key: 'ribbon', label: 'Ribbon', example: 'Bestseller', description: 'Badge text (New, Trending, etc.)' },
            { key: 'description', label: 'Description', example: 'Beautiful handcrafted bangles', description: 'Product description' },
            { key: 'images', label: 'Images', example: 'url1.jpg, url2.jpg', description: 'Comma-separated image URLs' },
            { key: 'status', label: 'Status', example: 'active', description: 'active or inactive (default: active)' },
        ]
    };

    // CSV Mapping State
    const [csvHeaderMapping, setCsvHeaderMapping] = useState<Record<string, string>>({});
    const [csvValidationErrors, setCsvValidationErrors] = useState<string[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [prodRes, catRes, typeRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories'),
                fetch('/api/product-types')
            ]);

            if (prodRes.ok) {
                const prods = await prodRes.json();
                setProducts(prods);
            }

            if (catRes.ok) {
                const cats = await catRes.json();
                setCategories(cats);
            }

            if (typeRes.ok) {
                const types = await typeRes.json();
                setProductTypes(types);
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

    // Filter products
    const filteredProducts = products.filter(product => {
        // Search filter - if empty search, match all
        const searchLower = searchQuery.toLowerCase().trim();
        const matchesSearch = !searchLower ||
            (product.name || '').toLowerCase().includes(searchLower) ||
            (product.category?.name || '').toLowerCase().includes(searchLower) ||
            (product.product_type?.name || '').toLowerCase().includes(searchLower);

        // Status filter - normalize to lowercase for comparison
        const productStatus = (product.status || '').toLowerCase().trim();
        const filterStatus = statusFilter.toLowerCase().trim();
        const matchesStatus = filterStatus === 'all' || productStatus === filterStatus;

        // Category filter
        const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;

        // Type filter
        const matchesType = typeFilter === 'all' || product.type_id === typeFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesType;
    });

    // Paginated products
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleSaveProduct = async (data: any) => {
        setIsSaving(true);
        setSaveError('');

        try {
            const formData = new FormData();
            formData.append('name', data.name || '');
            formData.append('subtitle', data.subtitle || '');
            formData.append('ribbon', data.ribbon || '');
            formData.append('description', data.description || '');
            formData.append('mrpPrice', data.mrpPrice?.toString() || '0');
            formData.append('offerPrice', data.offerPrice?.toString() || '');
            formData.append('category_id', data.category_id || '');
            formData.append('type_id', data.type_id || '');
            formData.append('product_title', data.product_title || 'Silk Thread');
            formData.append('status', data.status || 'active');
            formData.append('options', JSON.stringify(data.options || []));

            // Handle images
            if (data.id) {
                formData.append('existingImages', JSON.stringify(data.images || []));
            } else {
                formData.append('images', JSON.stringify(data.images || []));
            }

            let res;
            if (data.id) {
                res = await fetch(`/api/products/${data.id}`, {
                    method: 'PUT',
                    body: formData,
                });
            } else {
                res = await fetch('/api/products', {
                    method: 'POST',
                    body: formData,
                });
            }

            if (res.status === 409) {
                setSaveError('A product with this name already exists in the same category and type');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                setSaveError(errorData.error || 'Failed to save product');
                return;
            }

            await fetchData();
            setIsModalOpen(false);
            setEditingProduct(undefined);
        } catch (error) {
            console.error('Error saving product:', error);
            setSaveError('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenCreateMode = () => {
        setEditingProduct(undefined);
        setSaveError('');
        setIsModalOpen(true);
    };

    const handleRowClick = (product: Product) => {
        setEditingProduct(product);
        setSaveError('');
        setIsModalOpen(true);
    };

    const handleBulkStatusUpdate = async (status: string) => {
        try {
            const res = await fetch('/api/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedProducts, status }),
            });

            if (res.ok) {
                setSelectedProducts([]);
                fetchData();
            } else {
                alert('Failed to update products');
            }
        } catch (error) {
            console.error('Error updating products:', error);
            alert('An error occurred');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

        try {
            const res = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedProducts }),
            });

            if (res.ok) {
                setSelectedProducts([]);
                fetchData();
            } else {
                alert('Failed to delete products');
            }
        } catch (error) {
            console.error('Error deleting products:', error);
            alert('An error occurred');
        }
    };

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (selectedProducts.length === paginatedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(paginatedProducts.map(p => p.id));
        }
    };

    const toggleSelectProduct = (id: string, e: React.SyntheticEvent) => {
        e.stopPropagation();
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const resetFilters = () => {
        setStatusFilter('all');
        setCategoryFilter('all');
        setTypeFilter('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Get filtered types based on category
    const filteredTypeOptions = categoryFilter === 'all'
        ? productTypes
        : productTypes.filter((t: any) => t.category_id === categoryFilter);

    // ============================================
    // CSV IMPORT FUNCTIONALITY
    // ============================================

    const openImportModal = () => {
        setImportStep('instructions');
        setCsvPreviewData([]);
        setImportProgress({ current: 0, total: 0, success: 0, failed: 0, skipped: 0, duplicates: 0 });
        setImportLogs([]);
        setIsImportModalOpen(true);
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as any[];
                if (data.length === 0) {
                    setCsvValidationErrors(['CSV file is empty or has no valid rows']);
                    setImportStep('preview');
                    return;
                }

                // Get CSV headers (lowercase for matching)
                const csvHeaders = Object.keys(data[0] || {});
                const csvHeadersLower = csvHeaders.map(h => h.toLowerCase().trim());

                // Map CSV headers to our expected columns
                const mapping: Record<string, string> = {};
                const allColumns = [...CSV_COLUMNS.required, ...CSV_COLUMNS.optional];

                for (const col of allColumns) {
                    const foundIndex = csvHeadersLower.findIndex(h =>
                        h === col.key ||
                        h === col.label.toLowerCase() ||
                        h.replace(/[\s_-]/g, '') === col.key.replace(/[\s_-]/g, '')
                    );
                    if (foundIndex !== -1) {
                        mapping[col.key] = csvHeaders[foundIndex];
                    }
                }

                // Check for required columns
                const missingRequired = CSV_COLUMNS.required.filter(col => !mapping[col.key]);
                const errors: string[] = [];

                if (missingRequired.length > 0) {
                    errors.push(`Missing required columns: ${missingRequired.map(c => c.label).join(', ')}`);
                }

                setCsvHeaderMapping(mapping);
                setCsvValidationErrors(errors);
                setCsvPreviewData(data);
                setImportStep('preview');
            },
            error: (error) => {
                console.error('CSV Parse Error:', error);
                setCsvValidationErrors(['Failed to parse CSV file. Please check the file format.']);
                setImportStep('preview');
            }
        });

        e.target.value = ''; // Reset input
    };

    // Helper to get mapped value from row
    const getMappedValue = (row: any, key: string) => {
        const csvHeader = csvHeaderMapping[key];
        return csvHeader ? row[csvHeader] : '';
    };

    const processImport = async () => {
        if (csvPreviewData.length === 0) return;

        setIsImporting(true);
        setImportProgress({ current: 0, total: csvPreviewData.length, success: 0, failed: 0, duplicates: 0, skipped: 0 });
        setImportLogs([]);

        for (let i = 0; i < csvPreviewData.length; i++) {
            const row = csvPreviewData[i];
            try {
                // Use mapped values
                const categoryName = getMappedValue(row, 'category');
                const typeName = getMappedValue(row, 'type');
                const name = getMappedValue(row, 'name');
                const mrpPrice = getMappedValue(row, 'mrp price');
                const offerPrice = getMappedValue(row, 'offer price');
                const ribbon = getMappedValue(row, 'ribbon');
                const description = getMappedValue(row, 'description');
                const title = getMappedValue(row, 'title');
                const status = getMappedValue(row, 'status');
                const imageUrls = getMappedValue(row, 'images');

                // Normalize names (lowercase and trim)
                const normalizedCategoryName = (categoryName || '').toLowerCase().trim();
                const normalizedTypeName = (typeName || '').toLowerCase().trim();
                const normalizedProductName = (name || '').trim();



                // Category is required
                if (!normalizedCategoryName) {
                    throw new Error('Category name is required');
                }

                // Product name is required
                if (!normalizedProductName) {
                    throw new Error('Product name is required');
                }

                // Find category (case-insensitive match)
                let category = categories.find(c =>
                    c.name.toLowerCase().trim() === normalizedCategoryName
                );

                // Create category if not found
                if (!category) {
                    // Check if we already tried to create this category in this import session
                    const existingInList = categories.find(c =>
                        c.name.toLowerCase().trim() === normalizedCategoryName
                    );

                    if (existingInList) {
                        category = existingInList;
                    } else {
                        // Generate slug from name
                        const categorySlug = categoryName.trim()
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');

                        const catRes = await fetch('/api/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: categoryName.trim(),
                                slug: categorySlug
                            })
                        });

                        if (catRes.ok) {
                            const newCat = await catRes.json();
                            category = newCat;
                            // Add to local state to prevent duplicate creation attempts
                            categories.push(newCat);
                            setCategories([...categories]);
                            setImportLogs(prev => [...prev, {
                                message: `✓ Created category: "${newCat.name}"`,
                                type: 'success'
                            }]);
                        } else if (catRes.status === 409) {
                            // Already exists - fetch it
                            const refetchRes = await fetch('/api/categories');
                            if (refetchRes.ok) {
                                const allCats = await refetchRes.json();
                                category = allCats.find((c: any) =>
                                    c.name.toLowerCase().trim() === normalizedCategoryName
                                );
                                if (category) {
                                    categories.push(category);
                                    setCategories([...categories]);
                                }
                            }
                            if (!category) {
                                throw new Error(`Category "${categoryName}" exists but couldn't be fetched`);
                            }
                        } else {
                            throw new Error(`Failed to create category "${categoryName}"`);
                        }
                    }
                }

                // Find or create product type (REQUIRED - type_id cannot be null)
                let productType: any = null;

                // Type is required - skip if not provided
                if (!normalizedTypeName) {
                    setImportProgress(prev => ({ ...prev, skipped: prev.skipped + 1 }));
                    setImportLogs(prev => [...prev, {
                        message: `Row ${i + 1}: Skipped - Product type is required`,
                        type: 'skipped'
                    }]);
                    setImportProgress(prev => ({ ...prev, current: i + 1 }));
                    continue;
                }

                productType = productTypes.find(t =>
                    t.name.toLowerCase().trim() === normalizedTypeName
                );

                if (!productType) {
                    // Try to create the product type
                    const typeRes = await fetch('/api/product-types', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: typeName?.trim(),
                            category_id: category?.id
                        })
                    });

                    if (typeRes.ok) {
                        const newType = await typeRes.json();
                        productType = newType;
                        productTypes.push(newType);
                        setProductTypes([...productTypes]);
                        setImportLogs(prev => [...prev, {
                            message: `✓ Created type: "${newType.name}" in ${category?.name}`,
                            type: 'success'
                        }]);
                    } else if (typeRes.status === 409) {
                        // Already exists - find it in refetched data
                        const refetchRes = await fetch('/api/product-types');
                        if (refetchRes.ok) {
                            const allTypes = await refetchRes.json();
                            productType = allTypes.find((t: any) =>
                                t.name.toLowerCase().trim() === normalizedTypeName
                            );
                            if (productType) {
                                productTypes.push(productType);
                                setProductTypes([...productTypes]);
                            }
                        }
                    }

                    // If type creation failed, skip this row
                    if (!productType) {
                        setImportProgress(prev => ({ ...prev, skipped: prev.skipped + 1 }));
                        setImportLogs(prev => [...prev, {
                            message: `Row ${i + 1}: Skipped - Failed to create product type "${typeName}"`,
                            type: 'error'
                        }]);
                        setImportProgress(prev => ({ ...prev, current: i + 1 }));
                        continue; // Skip to next row
                    }
                }

                // Build form data
                const formData = new FormData();
                formData.append('name', normalizedProductName);
                formData.append('subtitle', '');
                formData.append('ribbon', (ribbon || '').trim());
                formData.append('description', (description || '').trim());
                formData.append('mrpPrice', mrpPrice || '0');
                formData.append('offerPrice', offerPrice || '');
                formData.append('category_id', category?.id || '');
                formData.append('type_id', productType.id);

                formData.append('product_title', (title || 'Silk Thread').trim());
                formData.append('status', (status || 'active').toLowerCase().trim());
                formData.append('options', '[]');

                // Handle image URLs - download from URL and upload to storage
                let finalImageUrls: string[] = [];
                const rawImageUrls = imageUrls ? imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [];

                if (rawImageUrls.length > 0) {
                    try {
                        // Upload images from URLs to storage
                        const uploadRes = await fetch('/api/upload-from-url', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ urls: rawImageUrls, bucket: 'products' })
                        });

                        if (uploadRes.ok) {
                            const uploadData = await uploadRes.json();
                            finalImageUrls = uploadData.uploadedUrls || [];

                            if (uploadData.errors?.length > 0) {
                                setImportLogs(prev => [...prev, {
                                    message: `Row ${i + 1}: Some images failed to upload`,
                                    type: 'duplicate'
                                }]);
                            }
                        } else {
                            // If upload fails, skip images but continue with product
                            setImportLogs(prev => [...prev, {
                                message: `Row ${i + 1}: Image upload failed - continuing without images`,
                                type: 'duplicate'
                            }]);
                        }
                    } catch (imgError) {
                        // Log but don't fail the product import
                        console.error('Image upload error:', imgError);
                    }
                }

                formData.append('images', JSON.stringify(finalImageUrls));

                const res = await fetch('/api/products', {
                    method: 'POST',
                    body: formData
                });

                if (res.status === 409) {
                    setImportProgress(prev => ({ ...prev, duplicates: prev.duplicates + 1 }));
                    setImportLogs(prev => [...prev, {
                        message: `Row ${i + 1}: "${row['Name'] || 'Unknown'}" - Duplicate`,
                        type: 'duplicate'
                    }]);
                } else if (!res.ok) {
                    throw new Error(`API Error: ${res.statusText}`);
                } else {
                    setImportProgress(prev => ({ ...prev, success: prev.success + 1 }));
                    setImportLogs(prev => [...prev, {
                        message: `Row ${i + 1}: "${row['Name'] || 'Unknown'}" - Success`,
                        type: 'success'
                    }]);
                }
            } catch (error: any) {
                console.error(`Import error row ${i + 1}:`, error);
                setImportProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
                setImportLogs(prev => [...prev, {
                    message: `Row ${i + 1}: "${row['Name'] || 'Unknown'}" - ${error.message}`,
                    type: 'error'
                }]);
            }

            setImportProgress(prev => ({ ...prev, current: i + 1 }));
        }

        setIsImporting(false);
        fetchData(); // Refresh list
    };

    const closeImportModal = () => {
        setIsImportModalOpen(false);
        setImportStep('instructions');
        setCsvPreviewData([]);
        setImportLogs([]);
        setImportProgress({ current: 0, total: 0, success: 0, failed: 0, duplicates: 0, skipped: 0 });
        setCsvHeaderMapping({});
        setCsvValidationErrors([]);
    };

    const downloadSampleCSV = () => {
        // Build headers from column definitions
        const headers = [
            ...CSV_COLUMNS.required.map(c => c.label),
            ...CSV_COLUMNS.optional.map(c => c.label)
        ];

        // Use actual category names from the database
        const catNames = categories.map(c => c.name);
        const typeNames = productTypes.map(t => t.name);

        // Generate sample data using real category/type names when available
        const cat1 = catNames[0] || 'Bangles';
        const cat2 = catNames[1] || 'Earing';
        const cat3 = catNames[2] || 'Hair Accessorie';
        const type1 = typeNames[0] || 'Kada Bangles';
        const type2 = typeNames[1] || 'Jhumkha';
        const type3 = typeNames[2] || 'Hair Band';

        const sampleData = [
            headers,
            [`Silk Thread ${type1} Set`, cat1, '599', type1, 'Silk Thread', '499', 'Bestseller', 'Beautiful handcrafted silk thread product', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 'active'],
            [`Traditional ${type2}`, cat2, '399', type2, 'Silk Thread', '349', 'New', 'Elegant traditional design with intricate silk thread work', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', 'active'],
            [`Designer ${type3}`, cat3, '299', type3, 'Silk Thread', '249', '', 'Colorful designer product for everyday use', 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400', 'active'],
        ];

        // Add a note about categories
        const noteRow = [`# NOTE: Category must match exactly. Available categories: ${catNames.join(', ')}`];

        const csvContent = [
            noteRow.join(','),
            ...sampleData.map(row =>
                row.map(cell => {
                    // Escape cells that contain commas
                    if (cell.includes(',')) {
                        return `"${cell}"`;
                    }
                    return cell;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'silk_thread_products_sample.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-display text-neutral-900">Products</h1>
                        <p className="text-neutral-500 font-sans mt-1">
                            Manage your boutique's inventory. ({products.length} total products)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleImportCSV}
                            className="hidden"
                        />
                        <Button
                            variant="secondary"
                            size="md"
                            prefixIcon={<Upload size={18} />}
                            onClick={openImportModal}
                        >
                            Import CSV
                        </Button>
                        <Button
                            size="md"
                            prefixIcon={<Plus size={18} />}
                            onClick={handleOpenCreateMode}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-neutral-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/10 outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`p-2 border rounded-lg transition-colors ${isFilterOpen || statusFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all'
                                    ? 'bg-secondary/10 border-secondary text-secondary'
                                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                    }`}
                                title="Filter Products"
                            >
                                <Filter size={18} />
                            </button>
                        </div>
                        {selectedProducts.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-neutral-600">{selectedProducts.length} selected</span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    prefixIcon={<CheckCircle size={16} />}
                                    onClick={() => handleBulkStatusUpdate('active')}
                                >
                                    Enable
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    prefixIcon={<XCircle size={16} />}
                                    onClick={() => handleBulkStatusUpdate('inactive')}
                                >
                                    Disable
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    prefixIcon={<Trash2 size={16} />}
                                    onClick={handleBulkDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Filter Panel */}
                    {isFilterOpen && (
                        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-wrap items-center gap-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-neutral-500 uppercase">Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/10 outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-neutral-500 uppercase">Category:</span>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); setTypeFilter('all'); setCurrentPage(1); }}
                                    className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/10 outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-neutral-500 uppercase">Type:</span>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/10 outline-none"
                                >
                                    <option value="all">All Types</option>
                                    {filteredTypeOptions.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            {(statusFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all') && (
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-red-500 hover:text-red-600 hover:underline px-2"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-neutral-400" size={32} />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                                <p className="text-neutral-500 mb-6">
                                    {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                                        ? 'Try adjusting your filters or search term.'
                                        : 'Get started by creating your first product.'}
                                </p>
                                {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') ? (
                                    <Button variant="secondary" size="md" onClick={resetFilters}>
                                        Clear Filters
                                    </Button>
                                ) : (
                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            prefixIcon={<Upload size={18} />}
                                            onClick={openImportModal}
                                        >
                                            Import CSV
                                        </Button>
                                        <Button
                                            size="md"
                                            prefixIcon={<Plus size={18} />}
                                            onClick={handleOpenCreateMode}
                                        >
                                            Add Product
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                        <th className="px-6 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                className="rounded border-neutral-300 text-secondary focus:ring-secondary cursor-pointer"
                                                checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {paginatedProducts.map((product) => {
                                        const discount = product.mrp_price && product.offer_price && product.mrp_price > product.offer_price
                                            ? Math.round(((product.mrp_price - product.offer_price) / product.mrp_price) * 100)
                                            : 0;

                                        return (
                                            <tr
                                                key={product.id}
                                                onClick={() => handleRowClick(product)}
                                                className="hover:bg-neutral-50/50 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-neutral-300 text-secondary focus:ring-secondary cursor-pointer"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={(e) => toggleSelectProduct(product.id, e)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0 relative">
                                                            {product.images?.[0] ? (
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    sizes="48px"
                                                                    className="object-cover"
                                                                    loading="lazy"
                                                                    placeholder="blur"
                                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                                                    <div className="w-4 h-4 bg-neutral-300 rounded-full" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-900 group-hover:text-secondary transition-colors">{product.name}</p>
                                                            {product.ribbon && (
                                                                <span className="text-[10px] font-semibold bg-secondary/10 text-secondary px-1.5 py-0.5 rounded mt-1 inline-block">
                                                                    {product.ribbon}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                        {product.product_title || 'Silk Thread'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md">
                                                        {product.category?.name || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-neutral-500">
                                                        {product.product_type?.name || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-neutral-900">
                                                            ₹{(product.offer_price || product.mrp_price)?.toLocaleString('en-IN')}
                                                        </span>
                                                        {discount > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-neutral-400 line-through">
                                                                    ₹{product.mrp_price?.toLocaleString('en-IN')}
                                                                </span>
                                                                <span className="text-xs text-green-600 font-medium">{discount}% off</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                        ${product.status === 'active'
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-neutral-50 text-neutral-500 border-neutral-200'}
                                                    `}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-neutral-400'}`} />
                                                        {product.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-neutral-400 hover:text-secondary transition-colors opacity-0 group-hover:opacity-100">
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {filteredProducts.length > productsPerPage && (
                                <div className="p-4 border-t border-neutral-100 flex items-center justify-between">
                                    <span className="text-sm text-neutral-500">
                                        Showing <span className="font-medium">{Math.min((currentPage - 1) * productsPerPage + 1, filteredProducts.length)}</span> to <span className="font-medium">{Math.min(currentPage * productsPerPage, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm font-medium text-neutral-700">
                                            Page {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={currentPage >= Math.ceil(filteredProducts.length / productsPerPage)}
                                            onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Product Form Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSaveError(''); }}
                    title={editingProduct ? "Edit Product" : "Add New Product"}
                >
                    {saveError && (
                        <div className="mx-6 mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                            {saveError}
                        </div>
                    )}
                    <ProductForm
                        onSubmit={handleSaveProduct}
                        onCancel={() => { setIsModalOpen(false); setSaveError(''); }}
                        initialData={editingProduct}
                        categories={categories}
                        productTypes={productTypes}
                    />
                </Modal>

                {/* Import CSV Modal */}
                <Modal
                    isOpen={isImportModalOpen}
                    onClose={closeImportModal}
                    title="Import Products from CSV"
                >
                    <div className="p-6 space-y-6">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleImportCSV}
                            className="hidden"
                        />

                        {/* Step 1: Instructions */}
                        {importStep === 'instructions' && (
                            <>
                                <div className="space-y-5">
                                    <div className="text-center py-3">
                                        <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileUp className="text-secondary" size={28} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                            Bulk Import Products
                                        </h3>
                                        <p className="text-sm text-neutral-500">
                                            Upload a CSV file with your product data
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4 justify-center">
                                        {/* Required Columns */}
                                        <div className="bg-red-50/50 border border-red-100 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                                                <XCircle size={14} className="text-red-500" />
                                                Required Columns
                                            </h4>
                                            <div className="space-y-2">
                                                {CSV_COLUMNS.required.map((col) => (
                                                    <div key={col.key} className="flex items-center gap-3 bg-white/80 rounded-lg px-3 py-2 border border-red-100">
                                                        <code className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded min-w-[90px]">
                                                            {col.label}
                                                        </code>
                                                        <span className="text-xs text-neutral-600 flex-1">{col.description}</span>
                                                        <span className="text-xs text-neutral-400 italic">e.g., {col.example}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Optional Columns */}
                                        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                                <Layers size={14} className="text-neutral-500" />
                                                Optional Columns
                                            </h4>
                                            <div className="space-y-2">
                                                {CSV_COLUMNS.optional.map((col) => (
                                                    <div key={col.key} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-neutral-100">
                                                        <code className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded min-w-[90px]">
                                                            {col.label}
                                                        </code>
                                                        <span className="text-xs text-neutral-600 flex-1">{col.description}</span>
                                                        <span className="text-xs text-neutral-400 italic">e.g., {col.example}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tips */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs space-y-1">
                                        <p className="font-semibold text-blue-800 flex items-center gap-1">
                                            <AlertTriangle size={12} />
                                            Tips:
                                        </p>
                                        <ul className="text-blue-700 ml-4 list-disc space-y-0.5">
                                            <li><strong>Category</strong> and <strong>Type</strong> are required (auto-created if not found)</li>
                                            <li><strong>Images</strong>: Use comma-separated URLs (will be uploaded to storage)</li>
                                            <li>Duplicates (same name + category + type + MRP price) will be skipped</li>
                                            <li>Rows with missing Type will be skipped</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between gap-3 pt-4 border-t border-neutral-100">
                                    <Button
                                        variant="primary"
                                        onClick={downloadSampleCSV}
                                        prefixIcon={<FileUp size={16} />}
                                    >
                                        Download Sample CSV
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant="ghost" onClick={closeImportModal}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            prefixIcon={<Upload size={16} />}
                                        >
                                            Select CSV File
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2: Preview & Validation */}
                        {importStep === 'preview' && (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${csvValidationErrors.length > 0 ? 'bg-red-500' : 'bg-green-500'}`} />
                                                File loaded: {csvPreviewData.length} rows found
                                            </h4>
                                            {csvValidationErrors.length === 0 && (
                                                <p className="text-xs text-green-600 flex items-center gap-1">
                                                    <CheckCircle size={10} />
                                                    All required columns found
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs text-secondary hover:underline border border-secondary/20 px-3 py-1.5 rounded-md hover:bg-secondary/5"
                                        >
                                            Choose another file
                                        </button>
                                    </div>

                                    {/* Validation Errors */}
                                    {csvValidationErrors.length > 0 && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                            <h5 className="text-xs font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                <XCircle size={12} />
                                                Validation Errors
                                            </h5>
                                            <ul className="space-y-1">
                                                {csvValidationErrors.map((err, i) => (
                                                    <li key={i} className="text-xs text-red-700 ml-4 list-disc">
                                                        {err}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Column Mapping Preview */}
                                    <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3">
                                        <h5 className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                                            <Layers size={12} />
                                            Column Mapping
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(csvHeaderMapping).map(([key, value]) => {
                                                const isRequired = CSV_COLUMNS.required.some(c => c.key === key);
                                                return (
                                                    <div key={key} className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1.5 ${isRequired
                                                        ? 'bg-green-50 border-green-200 text-green-800'
                                                        : 'bg-white border-neutral-200 text-neutral-600'
                                                        }`}>
                                                        <span className="font-semibold uppercase">{key}</span>
                                                        <span className="text-neutral-400">→</span>
                                                        <span className="text-neutral-900 bg-white/50 px-1 rounded">{value}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Data Preview table */}
                                    {csvPreviewData.length > 0 && (
                                        <div className="border border-neutral-200 rounded-lg overflow-hidden">
                                            <div className="max-h-56 overflow-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="bg-neutral-50 sticky top-0 z-10">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left font-semibold text-neutral-600 border-b w-12">#</th>
                                                            {[...CSV_COLUMNS.required, ...CSV_COLUMNS.optional].map((col) => {
                                                                const mappedHeader = csvHeaderMapping[col.key];
                                                                if (!mappedHeader) return null;
                                                                return (
                                                                    <th key={col.key} className="px-3 py-2 text-left font-semibold text-neutral-600 whitespace-nowrap border-b min-w-[120px]">
                                                                        {col.label} (from "{mappedHeader}")
                                                                    </th>
                                                                );
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-100">
                                                        {csvPreviewData.slice(0, 5).map((row, index) => (
                                                            <tr key={index} className="hover:bg-neutral-50">
                                                                <td className="px-3 py-2 text-neutral-400 border-r bg-neutral-50/50">{index + 1}</td>
                                                                {[...CSV_COLUMNS.required, ...CSV_COLUMNS.optional].map((col) => {
                                                                    const val = getMappedValue(row, col.key);
                                                                    if (!csvHeaderMapping[col.key]) return null;
                                                                    return (
                                                                        <td key={col.key} className="px-3 py-2 text-neutral-700 max-w-[200px] truncate">
                                                                            {col.key === 'images' && val ? (
                                                                                <div className="flex -space-x-2 overflow-hidden py-1">
                                                                                    {val.split(',').filter((u: string) => u.trim()).slice(0, 3).map((url: string, i: number) => (
                                                                                        <div key={i} className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white bg-neutral-100 overflow-hidden">
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
                                                                                    {val.split(',').filter((u: string) => u.trim()).length > 3 && (
                                                                                        <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-neutral-100 text-[10px] font-medium text-neutral-500">
                                                                                            +{val.split(',').filter((u: string) => u.trim()).length - 3}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                val || <span className="text-neutral-300 italic">empty</span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="bg-neutral-50 px-3 py-1.5 border-t border-neutral-200 text-[10px] text-neutral-500 text-center">
                                                Previewing first 5 of {csvPreviewData.length} rows
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                                    <Button variant="ghost" onClick={() => setImportStep('instructions')}>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={processImport}
                                        disabled={csvPreviewData.length === 0 || csvValidationErrors.length > 0}
                                        prefixIcon={<Upload size={16} />}
                                        className={csvValidationErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                        Import {csvPreviewData.length} Products
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Step 3: Importing / Complete */}
                        {(importStep === 'importing' || isImporting || importProgress.current > 0) && (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-600">Progress</span>
                                        <span className="font-semibold text-neutral-900">
                                            {importProgress.current} / {importProgress.total}
                                        </span>
                                    </div>

                                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                                        <div
                                            className="bg-secondary h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                                <CheckCircle size={16} />
                                                <span className="text-lg font-bold">{importProgress.success}</span>
                                            </div>
                                            <span className="text-xs text-green-600">Success</span>
                                        </div>
                                        <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                                                <AlertTriangle size={16} />
                                                <span className="text-lg font-bold">{importProgress.duplicates}</span>
                                            </div>
                                            <span className="text-xs text-yellow-600">Duplicates</span>
                                        </div>
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                                                <AlertTriangle size={16} />
                                                <span className="text-lg font-bold">{importProgress.skipped}</span>
                                            </div>
                                            <span className="text-xs text-orange-600">Skipped</span>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-3 text-center">
                                            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                                                <XCircle size={16} />
                                                <span className="text-lg font-bold">{importProgress.failed}</span>
                                            </div>
                                            <span className="text-xs text-red-600">Failed</span>
                                        </div>
                                    </div>

                                    {/* Import Logs */}
                                    {importLogs.length > 0 && (
                                        <div className="max-h-48 overflow-auto border border-neutral-200 rounded-lg p-3 space-y-1 bg-neutral-50">
                                            {importLogs.map((log, index) => (
                                                <div
                                                    key={index}
                                                    className={`text-xs flex items-center gap-2 ${log.type === 'success' ? 'text-green-600' :
                                                        log.type === 'duplicate' ? 'text-yellow-600' :
                                                            log.type === 'skipped' ? 'text-orange-600' :
                                                                'text-red-600'
                                                        }`}
                                                >
                                                    {log.type === 'success' ? <CheckCircle size={12} /> :
                                                        log.type === 'duplicate' ? <AlertTriangle size={12} /> :
                                                            log.type === 'skipped' ? <AlertTriangle size={12} /> :
                                                                <XCircle size={12} />}
                                                    {log.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                                    {isImporting ? (
                                        <Button disabled prefixIcon={<Loader2 size={16} className="animate-spin" />}>
                                            Importing...
                                        </Button>
                                    ) : (
                                        <Button onClick={closeImportModal}>
                                            Done
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </main>
        </div>
    );
}
