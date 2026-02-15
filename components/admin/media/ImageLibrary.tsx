'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Check, Loader2, Upload, Trash2, Folder, RefreshCw, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { compressImage, validateFileSize, MAX_FILE_SIZE } from '@/utils/image-compression';

interface ImageLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (urls: string[]) => void;
    multiple?: boolean;
    initialSelected?: string[];
}

interface MediaItem {
    name: string;
    url: string;
    created_at: string;
    folder: string;
    bucket: string;
}

export default function ImageLibrary({ isOpen, onClose, onSelect, multiple = true, initialSelected = [] }: ImageLibraryProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
    const [folders, setFolders] = useState<string[]>([]);
    const [activeFolder, setActiveFolder] = useState<string>('all');

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/media');
            if (res.ok) {
                const data: MediaItem[] = await res.json();
                setMediaItems(data);

                // Extract unique folders
                const uniqueFolders = [...new Set(data.map(item => item.folder))];
                setFolders(uniqueFolders);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedUrls(initialSelected);
            setActiveFolder('all');
        }
    }, [isOpen]);

    const handleImageClick = (url: string) => {
        if (multiple) {
            // Toggle selection
            setSelectedUrls(prev =>
                prev.includes(url)
                    ? prev.filter(u => u !== url)
                    : [...prev, url]
            );
        } else {
            // Single select mode
            setSelectedUrls([url]);
        }
    };

    const handleSelectAll = () => {
        const filteredUrls = filteredMedia.map(item => item.url);
        setSelectedUrls(prev => {
            const allSelected = filteredUrls.every(url => prev.includes(url));
            if (allSelected) {
                // Deselect all filtered
                return prev.filter(url => !filteredUrls.includes(url));
            } else {
                // Select all filtered
                return [...new Set([...prev, ...filteredUrls])];
            }
        });
    };

    const handleDelete = async (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch('/api/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                fetchMedia();
                // Remove from selection if deleted
                const deletedItem = mediaItems.find(m => m.name === name);
                if (deletedItem) {
                    setSelectedUrls(prev => prev.filter(u => u !== deletedItem.url));
                }
            } else {
                alert('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('An error occurred');
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Validate file sizes
        const oversizedFiles = Array.from(files).filter(f => !validateFileSize(f).valid);
        if (oversizedFiles.length > 0) {
            alert(`Some files exceed the ${MAX_FILE_SIZE / 1024 / 1024}MB limit:\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join('\n')}`);
            return;
        }

        setIsUploading(true);
        setUploadProgress({ current: 0, total: files.length });

        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                // Compress image client-side before upload
                const compressed = await compressImage(files[i]);
                const formData = new FormData();
                formData.append('file', compressed);

                const res = await fetch('/api/media', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                }

                setUploadProgress({ current: i + 1, total: files.length });
            }

            // Refresh media list
            await fetchMedia();

            // Auto-select uploaded images
            setSelectedUrls(prev => [...prev, ...uploadedUrls]);

        } catch (error) {
            console.error('Error uploading:', error);
            alert('Upload error');
        } finally {
            setIsUploading(false);
            setUploadProgress(null);
            // Reset file input
            e.target.value = '';
        }
    };

    // Filter media by active folder
    const filteredMedia = activeFolder === 'all'
        ? mediaItems
        : mediaItems.filter(item => item.folder === activeFolder);

    // Check if all filtered items are selected
    const allFilteredSelected = filteredMedia.length > 0 && filteredMedia.every(item => selectedUrls.includes(item.url));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Image Library"
        >
            <div className="flex flex-col h-[70vh]">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchMedia}
                            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-white rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <p className="text-xs text-neutral-500">
                            {filteredMedia.length} image{filteredMedia.length !== 1 ? 's' : ''}
                        </p>
                        {multiple && filteredMedia.length > 0 && (
                            <button
                                onClick={handleSelectAll}
                                className="text-xs text-secondary hover:underline"
                            >
                                {allFilteredSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        )}
                    </div>
                    <label className="cursor-pointer bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                        {isUploading ? (
                            <>
                                <Loader2 size={12} className="animate-spin" />
                                {uploadProgress && `${uploadProgress.current}/${uploadProgress.total}`}
                            </>
                        ) : (
                            <>
                                <Upload size={12} />
                                Upload Images
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {/* Folder Tabs */}
                {folders.length > 1 && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-100 overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveFolder('all')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeFolder === 'all'
                                ? 'bg-secondary text-white'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                        >
                            <Folder size={12} />
                            All ({mediaItems.length})
                        </button>
                        {folders.map(folder => (
                            <button
                                key={folder}
                                onClick={() => setActiveFolder(folder)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeFolder === folder
                                    ? 'bg-secondary text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                    }`}
                            >
                                <Folder size={12} />
                                {folder === 'root' ? 'Root' : folder.split('/').pop()}
                                <span className="opacity-60">
                                    ({mediaItems.filter(m => m.folder === folder).length})
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected Images Preview (when multiple) */}
                {multiple && selectedUrls.length > 0 && (
                    <div className="px-4 py-2 border-b border-neutral-100 bg-secondary/5">
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                            <span className="text-xs text-secondary font-medium shrink-0">
                                {selectedUrls.length} selected:
                            </span>
                            {selectedUrls.map(url => (
                                <div key={url} className="relative shrink-0 group">
                                    <div className="relative w-10 h-10 rounded border border-secondary/30 overflow-hidden">
                                        <Image
                                            src={url}
                                            alt=""
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSelectedUrls(prev => prev.filter(u => u !== url))}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Grid */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-neutral-400" size={24} />
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <p className="text-sm">No images found</p>
                            <p className="text-xs mt-1">Upload images to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {filteredMedia.map((item) => {
                                const isSelected = selectedUrls.includes(item.url);
                                const selectionIndex = selectedUrls.indexOf(item.url);

                                return (
                                    <div
                                        key={item.name}
                                        onClick={() => handleImageClick(item.url)}
                                        className={`
                                            relative aspect-square rounded-lg border cursor-pointer overflow-hidden group
                                            ${isSelected ? 'border-secondary ring-2 ring-secondary/20' : 'border-neutral-200 hover:border-neutral-300'}
                                        `}
                                    >
                                        <Image
                                            src={item.url}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 16vw"
                                            className="object-cover"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                        />

                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
                                                <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                    {multiple ? selectionIndex + 1 : <Check size={14} />}
                                                </div>
                                            </div>
                                        )}

                                        {/* Folder Badge */}
                                        {activeFolder === 'all' && item.folder !== 'root' && (
                                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[9px] rounded">
                                                {item.folder.split('/').pop()}
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(item.name, e)}
                                            className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow-sm border border-neutral-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 z-10"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-100 flex justify-between items-center bg-neutral-50/30">
                    <div className="text-xs text-neutral-500">
                        {selectedUrls.length > 0 && (
                            <span className="text-secondary font-medium">
                                {selectedUrls.length} image{selectedUrls.length !== 1 ? 's' : ''} selected
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
                        <Button
                            disabled={selectedUrls.length === 0}
                            onClick={() => {
                                onSelect(selectedUrls);
                                onClose();
                            }}
                            size="sm"
                        >
                            {multiple ? `Select ${selectedUrls.length} Image${selectedUrls.length !== 1 ? 's' : ''}` : 'Select Image'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
