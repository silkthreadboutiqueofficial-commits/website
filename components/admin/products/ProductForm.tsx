import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Trash, X, Image as ImageIcon, IndianRupee, Layers, Tag, Type, AlignLeft, Image as ImageLucide, Palette } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import ImageLibrary from '@/components/admin/media/ImageLibrary';
import {
    DEFAULT_COLORS,
    DEFAULT_KIDS_SIZES,
    DEFAULT_ADULT_SIZES,
} from '@/lib/data';

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

interface ProductFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialData?: any;
    categories?: Category[];
    productTypes?: ProductType[];
}

interface Variant {
    name: string;
    price: string;
    sale_price?: string;
}

interface ProductOption {
    name: string;
    variants: Variant[];
}

export default function ProductForm({ onSubmit, onCancel, initialData, categories = [], productTypes = [] }: ProductFormProps) {
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        type_id: '',
        product_title: 'Silk Thread',
        ribbon: '',
        description: '',
        mrpPrice: '',
        offerPrice: '',
    });

    // Get filtered types based on selected category
    const filteredTypes = useMemo(() => {
        if (!formData.category_id) return productTypes;
        return productTypes.filter(t => t.category_id === formData.category_id);
    }, [formData.category_id, productTypes]);

    // Load Initial Data for Edit Mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                category_id: initialData.category_id || '',
                type_id: initialData.type_id || '',
                product_title: initialData.product_title || 'Silk Thread',
                ribbon: initialData.ribbon || '',
                description: initialData.description || '',
                mrpPrice: initialData.mrp_price ? initialData.mrp_price.toString() : '',
                offerPrice: initialData.offer_price ? initialData.offer_price.toString() : '',
            });

            if (initialData.options) {
                setOptions(Array.isArray(initialData.options) ? initialData.options : JSON.parse(initialData.options));
            }

            if (initialData.images && Array.isArray(initialData.images)) {
                setExistingImages(initialData.images);
            }

            if (initialData.status) {
                setIsActive(initialData.status === 'active');
            }
        } else {
            // Reset form when switching to Create Mode
            setFormData({
                name: '',
                category_id: '',
                type_id: '',
                product_title: 'Silk Thread',
                ribbon: '',
                description: '',
                mrpPrice: '',
                offerPrice: '',
            });
            setOptions([]);
            setExistingImages([]);
            setIsActive(true);
        }
    }, [initialData]);

    // Regular expressions for validation
    const numberOnlyRegex = /^[0-9]*\.?[0-9]*$/;

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleLibrarySelect = (urls: string[]) => {
        // Add new images to existing ones, avoiding duplicates
        const newImages = urls.filter(url => !existingImages.includes(url));
        setExistingImages([...existingImages, ...newImages]);
    };

    const addOption = () => {
        setOptions([...options, {
            name: '',
            variants: [{
                name: '',
                price: formData.mrpPrice,
                sale_price: formData.offerPrice
            }]
        }]);
    };

    // Quick add default color option
    const addColorOption = () => {
        const colorOption: ProductOption = {
            name: 'Color',
            variants: DEFAULT_COLORS.map(color => ({
                name: color,
                price: formData.mrpPrice,
                sale_price: formData.offerPrice
            }))
        };
        setOptions([...options, colorOption]);
    };

    // Quick add kids size option
    const addKidsSizeOption = () => {
        const sizeOption: ProductOption = {
            name: 'Kids Size',
            variants: DEFAULT_KIDS_SIZES.map(size => ({
                name: size,
                price: formData.mrpPrice,
                sale_price: formData.offerPrice
            }))
        };
        setOptions([...options, sizeOption]);
    };

    // Quick add adult size option
    const addAdultSizeOption = () => {
        const sizeOption: ProductOption = {
            name: 'Adult Size',
            variants: DEFAULT_ADULT_SIZES.map(size => ({
                name: size,
                price: formData.mrpPrice,
                sale_price: formData.offerPrice
            }))
        };
        setOptions([...options, sizeOption]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const updateOptionName = (index: number, name: string) => {
        const newOptions = [...options];
        newOptions[index].name = name;
        setOptions(newOptions);
    };

    const addVariant = (optionIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].variants.push({
            name: '',
            price: formData.mrpPrice,
            sale_price: formData.offerPrice
        });
        setOptions(newOptions);
    };

    const removeVariant = (optionIndex: number, variantIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].variants = newOptions[optionIndex].variants.filter((_, i) => i !== variantIndex);
        setOptions(newOptions);
    };

    const updateVariant = (optionIndex: number, variantIndex: number, field: keyof Variant, value: string) => {
        if ((field === 'price' || field === 'sale_price') && value && !numberOnlyRegex.test(value)) {
            return;
        }

        const newOptions = [...options];
        newOptions[optionIndex].variants[variantIndex] = {
            ...newOptions[optionIndex].variants[variantIndex],
            [field]: value
        };
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            mrpPrice: parseFloat(formData.mrpPrice) || 0,
            offerPrice: parseFloat(formData.offerPrice) || 0,
            options,
            images: existingImages,
            status: isActive ? 'active' : 'inactive',
            id: initialData?.id
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-neutral-50/50">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 custom-scrollbar">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">

                    {/* LEFT COLUMN: Images & Basic Info */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* 1. Image Upload Section */}
                        <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                    <ImageIcon size={18} className="text-secondary" />
                                    Product Images
                                </h3>
                                <span className="text-xs text-neutral-400">First image is cover</span>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                                {/* Existing Images */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative flex-shrink-0 w-24 h-24 rounded-lg border border-neutral-200 group overflow-hidden bg-neutral-50 snap-start">
                                        <Image
                                            src={url}
                                            alt={`Product ${index}`}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-sm border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                        >
                                            <X size={12} />
                                        </button>
                                        {(index === 0) && (
                                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                                Cover
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setIsLibraryOpen(true)}
                                    className={`
                                        cursor-pointer flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-neutral-200 
                                        flex flex-col items-center justify-center bg-neutral-50 hover:border-secondary/50 hover:bg-secondary/5 transition-all group
                                    `}>
                                    <div className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center mb-1 shadow-sm group-hover:scale-110 transition-transform">
                                        <ImageLucide size={16} className="text-neutral-400 group-hover:text-secondary" />
                                    </div>
                                    <span className="text-[10px] font-medium text-neutral-600 group-hover:text-secondary">Add Image</span>
                                </button>
                            </div>
                        </section>

                        {/* 2. Basic Details Section */}
                        <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                    <Type size={18} className="text-secondary" />
                                    Product Information
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-neutral-500'}`}>
                                        {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                                </div>
                            </div>

                            {/* Product Name */}
                            <Input
                                label="Product Name"
                                placeholder="E.g., Premium Kada Bangles"
                                required
                                value={formData.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                prefixIcon={<Tag size={16} />}
                            />

                            {/* Category & Type in Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category Select */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                                        <select
                                            required
                                            className="w-full bg-white rounded-lg border border-neutral-200 pl-10 pr-4 py-2.5 text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all appearance-none"
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value, type_id: '' })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Type Select */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-neutral-700">
                                        Product Type
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                                        <select
                                            className="w-full bg-white rounded-lg border border-neutral-200 pl-10 pr-4 py-2.5 text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all appearance-none"
                                            value={formData.type_id}
                                            onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                                        >
                                            <option value="">Select Type</option>
                                            {filteredTypes.map((type) => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Product Title */}
                            <Input
                                label="Product Title (Material/Brand)"
                                placeholder="E.g., Silk Thread"
                                value={formData.product_title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, product_title: e.target.value })
                                }
                                prefixIcon={<Type size={16} />}
                            />

                            {/* Ribbon */}
                            <Input
                                label="Ribbon Badge (Optional)"
                                placeholder="E.g., Bestseller, New, Trending"
                                value={formData.ribbon}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, ribbon: e.target.value })
                                }
                                prefixIcon={<Tag size={16} />}
                            />

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-neutral-700">
                                    Description
                                </label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 text-neutral-400 pointer-events-none" size={16} />
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your product..."
                                        className="w-full bg-white rounded-lg border border-neutral-200 pl-10 pr-4 py-2.5 text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Pricing & Options */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* 3. Pricing Section */}
                        <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-5">
                            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                <IndianRupee size={18} className="text-secondary" />
                                Pricing
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="MRP Price"
                                    placeholder="0.00"
                                    required
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.mrpPrice}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const val = e.target.value;
                                        if (val === '' || numberOnlyRegex.test(val)) {
                                            setFormData({ ...formData, mrpPrice: val });
                                        }
                                    }}
                                    prefixIcon={<span className="text-neutral-500 text-sm">₹</span>}
                                />
                                <Input
                                    label="Offer Price"
                                    placeholder="0.00"
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.offerPrice}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const val = e.target.value;
                                        if (val === '' || numberOnlyRegex.test(val)) {
                                            setFormData({ ...formData, offerPrice: val });
                                        }
                                    }}
                                    prefixIcon={<span className="text-neutral-500 text-sm">₹</span>}
                                />
                            </div>

                            {formData.mrpPrice && formData.offerPrice && parseFloat(formData.offerPrice) < parseFloat(formData.mrpPrice) && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <span className="text-green-600 text-sm font-medium">
                                        {Math.round(((parseFloat(formData.mrpPrice) - parseFloat(formData.offerPrice)) / parseFloat(formData.mrpPrice)) * 100)}% discount
                                    </span>
                                </div>
                            )}
                        </section>

                        {/* 4. Options & Variants Section */}
                        <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                    <Palette size={18} className="text-secondary" />
                                    Options & Variants
                                </h3>
                            </div>

                            {/* Quick Add Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={addColorOption}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Palette size={12} />
                                    + Colors
                                </button>
                                <button
                                    type="button"
                                    onClick={addKidsSizeOption}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    + Kids Sizes
                                </button>
                                <button
                                    type="button"
                                    onClick={addAdultSizeOption}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    + Adult Sizes
                                </button>
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-50 text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
                                >
                                    <Plus size={12} />
                                    Custom
                                </button>
                            </div>

                            {/* Options List */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {options.length === 0 && (
                                    <p className="text-xs text-neutral-400 text-center py-6">
                                        No options added yet. Use buttons above to add.
                                    </p>
                                )}

                                {options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="border border-neutral-100 rounded-lg p-4 bg-neutral-50/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={option.name}
                                                onChange={(e) => updateOptionName(optionIndex, e.target.value)}
                                                placeholder="Option Name (e.g. Color)"
                                                className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeOption(optionIndex)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>

                                        {/* Variants */}
                                        <div className="space-y-2">
                                            {option.variants.map((variant, variantIndex) => (
                                                <div key={variantIndex} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-neutral-100">
                                                    <input
                                                        type="text"
                                                        value={variant.name}
                                                        onChange={(e) => updateVariant(optionIndex, variantIndex, 'name', e.target.value)}
                                                        placeholder="Value"
                                                        className="flex-1 px-2 py-1.5 rounded border border-neutral-200 text-xs bg-white focus:border-secondary outline-none min-w-0"
                                                    />
                                                    <div className="flex items-center gap-1 text-neutral-400">
                                                        <span className="text-xs">₹</span>
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            value={variant.price}
                                                            onChange={(e) => updateVariant(optionIndex, variantIndex, 'price', e.target.value)}
                                                            placeholder="MRP"
                                                            className="w-16 px-2 py-1.5 rounded border border-neutral-200 text-xs bg-white focus:border-secondary outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-neutral-400">
                                                        <span className="text-xs">₹</span>
                                                        <input
                                                            type="text"
                                                            inputMode="decimal"
                                                            value={variant.sale_price || ''}
                                                            onChange={(e) => updateVariant(optionIndex, variantIndex, 'sale_price', e.target.value)}
                                                            placeholder="Offer"
                                                            className="w-16 px-2 py-1.5 rounded border border-neutral-200 text-xs bg-white focus:border-secondary outline-none"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(optionIndex, variantIndex)}
                                                        className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => addVariant(optionIndex)}
                                            className="mt-2 text-xs text-secondary hover:text-secondary/80 font-medium flex items-center gap-1"
                                        >
                                            <Plus size={12} />
                                            Add Value
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData?.id ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </div>

            {/* Image Library Modal */}
            <ImageLibrary
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleLibrarySelect}
                multiple={true}
                initialSelected={existingImages}
            />
        </form>
    );
}
