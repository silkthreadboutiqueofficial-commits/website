'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { Save, Globe, Mail, Shield, Instagram, Facebook, Youtube, Twitter, Loader2, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        brand_name: '',
        description: '',
        email: '',
        phone: '',
        whatsapp_number: '',
        address: '',
        city: '',
        state: '',
        instagram_url: '',
        facebook_url: '',
        youtube_url: '',
        twitter_url: '',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) {
                console.error('Failed to fetch settings:', res.status, res.statusText);
                return;
            }

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (data && !data.error) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } else {
                const text = await res.text();
                console.error('Settings API returned non-JSON:', text);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error('Failed to save');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwords.current || !passwords.new) {
            alert("Please fill in both fields");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update password');
            }

            alert('Password updated successfully!');
            setPasswords({ current: '', new: '' });
        } catch (error: any) {
            console.error('Error updating password:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'contact', label: 'Contact Info', icon: Mail },
        { id: 'social', label: 'Social Media', icon: Instagram },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
                <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-display text-neutral-900">Settings</h1>
                    <p className="text-neutral-500 font-sans mt-1">Manage your boutique's configuration and preferences.</p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden max-w-5xl">
                    <div className="flex border-b border-neutral-100 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative min-w-fit ${activeTab === tab.id
                                    ? 'text-secondary'
                                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span className={activeTab === tab.id ? 'text-neutral-900' : ''}>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {activeTab === 'general' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Brand Name</label>
                                    <input
                                        type="text"
                                        value={settings.brand_name || ''}
                                        onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-neutral-300"
                                        placeholder="e.g. Silk Thread Boutique"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Description</label>
                                    <textarea
                                        rows={4}
                                        value={settings.description || ''}
                                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none placeholder:text-neutral-300"
                                        placeholder="Brief description about your boutique..."
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button
                                        prefixIcon={saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                value={settings.email || ''}
                                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={settings.phone || ''}
                                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">WhatsApp Number</label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={settings.whatsapp_number || ''}
                                            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                            placeholder="+91 98765 43210 (with country code)"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-400">Used for WhatsApp chat button on website. If empty, phone number will be used.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Full Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={settings.address || ''}
                                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                            placeholder="123 Fashion St, Design City, DC 560001"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-700">City</label>
                                        <input
                                            type="text"
                                            value={settings.city || ''}
                                            onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                            placeholder="e.g. Bangalore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-700">State</label>
                                        <input
                                            type="text"
                                            value={settings.state || ''}
                                            onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                            placeholder="e.g. Karnataka"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-400">City and State are used for the map location on the Contact Us page.</p>

                                <div className="pt-4">
                                    <Button
                                        prefixIcon={saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'Updating...' : 'Update Contact Info'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-2.5 rounded-lg text-white">
                                            <Instagram size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={settings.instagram_url || ''}
                                            onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                            placeholder="Instagram URL"
                                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-600 p-2.5 rounded-lg text-white">
                                            <Facebook size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={settings.facebook_url || ''}
                                            onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                            placeholder="Facebook URL"
                                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-600 p-2.5 rounded-lg text-white">
                                            <Youtube size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={settings.youtube_url || ''}
                                            onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                            placeholder="Youtube URL"
                                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-black p-2.5 rounded-lg text-white">
                                            <Twitter size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={settings.twitter_url || ''}
                                            onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                                            placeholder="X (Twitter) URL"
                                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button
                                        prefixIcon={saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Socials'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4 text-amber-800">
                                    <Shield className="shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-sm">Update Password</p>
                                        <p className="text-xs opacity-80">Ensure your account is using a long, random password to stay secure.</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button
                                        variant="primary"
                                        prefixIcon={saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        onClick={handlePasswordChange}
                                        disabled={saving}
                                    >
                                        {saving ? 'Updating...' : 'Change Password'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
