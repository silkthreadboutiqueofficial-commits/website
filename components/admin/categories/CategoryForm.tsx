import { useState, useEffect } from 'react';
import { Plus, Type } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CategoryFormProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    initialData?: any;
}

export default function CategoryForm({ onSubmit, onCancel, isLoading, initialData }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                slug: initialData.slug || '',
                description: initialData.description || ''
            });
        }
    }, [initialData]);

    // ... rest of component


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-neutral-50/50">
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">

                <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Type size={18} className="text-secondary" />
                        <h3 className="text-sm font-semibold text-neutral-900">Basic Details</h3>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Category Name"
                            placeholder="e.g. Sarees"
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                        />

                        <Input
                            label="Slug"
                            placeholder="e.g. sarees"
                            required
                            value={formData.slug}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, slug: e.target.value })}
                            className="opacity-70"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-neutral-700">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all resize-none text-sm placeholder:text-neutral-400"
                        placeholder="Category description..."
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-100 bg-white">
                <Button variant="ghost" onClick={onCancel} type="button" disabled={isLoading}>Cancel</Button>
                <Button type="submit" prefixIcon={<Plus size={18} />} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Category'}
                </Button>
            </div>
        </form>
    );
}

