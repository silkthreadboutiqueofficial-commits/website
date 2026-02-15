'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Clock, Instagram, Youtube, MessageCircle, ArrowRight } from "lucide-react";

interface Settings {
    instagram_url?: string;
    youtube_url?: string;
    email?: string;
    phone?: string;
    address?: string;
    whatsapp_number?: string;
    city?: string;
    state?: string;
}

export default function ContactPage() {
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleWhatsAppContact = () => {
        const phone = settings.whatsapp_number || settings.phone || '';
        if (!phone) return;
        const cleanPhone = phone.replace(/\D/g, '');
        const message = encodeURIComponent("Hi! I'm reaching out from your website.");
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    };

    // Map location - use city/state if available, otherwise use address
    const mapQuery = settings.city && settings.state
        ? `${settings.city} ${settings.state}`
        : settings.address || 'India';

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24 md:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="sizer relative z-10 pt-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
                            Get in Touch
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                            Contact <span className="text-secondary">Us</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto">
                            Have a question or need a custom order? We're here to help you find the perfect piece.
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent" />
            </section>

            {/* Contact Info Section */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Call Us */}
                        {settings.phone && (
                            <a
                                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                                className="group bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg transition-all text-center"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <Phone size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">Call Us</h3>
                                <p className="text-secondary font-medium">{settings.phone}</p>
                                <p className="text-neutral-500 text-sm mt-1">Mon-Sat, 10am - 7pm</p>
                            </a>
                        )}

                        {/* Email Us */}
                        {settings.email && (
                            <a
                                href={`mailto:${settings.email}`}
                                className="group text-wrap bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg transition-all text-center"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <Mail size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">Email Us</h3>
                                <p className="text-secondary font-medium text-sm">{settings.email}</p>
                                <p className="text-neutral-500 text-sm mt-1">Reply within 24 hours</p>
                            </a>
                        )}

                        {/* Our Store */}
                        {settings.address && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4">
                                    <MapPin size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">Our Store</h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">{settings.address}</p>
                            </div>
                        )}

                        {/* Store Hours */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4">
                                <Clock size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">Store Hours</h3>
                            <div className="text-sm space-y-1">
                                <p className="text-neutral-600">Mon - Sat: <span className="font-medium text-neutral-900">10am - 7pm</span></p>
                                <p className="text-neutral-600">Sunday: <span className="font-medium text-red-500">Closed</span></p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Follow Us & WhatsApp Section */}
            <section className="pb-20 bg-neutral-50">
                <div className="sizer">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Follow Us */}
                        <div className="bg-secondary/5 rounded-2xl p-8 md:p-10">
                            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-3">Follow Us</h2>
                            <p className="text-neutral-600 mb-6">Stay connected for latest designs, offers, and updates!</p>
                            <div className="flex flex-wrap gap-4">
                                {settings.instagram_url && (
                                    <a
                                        href={settings.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium border border-neutral-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                                    >
                                        <Instagram size={18} className="text-pink-500" />
                                        Instagram
                                    </a>
                                )}
                                {settings.youtube_url && (
                                    <a
                                        href={settings.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium border border-neutral-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
                                    >
                                        <Youtube size={18} className="text-red-500" />
                                        YouTube
                                    </a>
                                )}
                                {!settings.instagram_url && !settings.youtube_url && (
                                    <>
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium border border-neutral-200">
                                            <Instagram size={18} className="text-pink-500" />
                                            Instagram
                                        </span>
                                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium border border-neutral-200">
                                            <Youtube size={18} className="text-red-500" />
                                            YouTube
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp */}
                        {(settings.whatsapp_number || settings.phone) && (
                            <button
                                onClick={handleWhatsAppContact}
                                className="group bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl p-8 md:p-10 text-white text-left transition-all hover:shadow-2xl hover:shadow-green-500/20"
                            >
                                <div className="flex items-start justify-between h-full">
                                    <div>
                                        <h2 className="text-2xl font-display font-bold mb-3">Chat on WhatsApp</h2>
                                        <p className="text-white/80 mb-6">Get instant replies and personalized assistance for your queries.</p>
                                        <span className="inline-flex items-center gap-2 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                                            Start Chat <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                                        <MessageCircle size={28} />
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="pb-20 bg-neutral-50">
                <div className="sizer">
                    <div className="w-full h-96 md:h-[500px] bg-neutral-200 rounded-2xl overflow-hidden shadow-sm relative">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            title="Location Map"
                            className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>
                </div>
            </section>
        </main>
    );
}
