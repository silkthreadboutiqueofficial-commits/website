'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { footerLinks } from '@/lib/data';
import { Mail, MapPin, Phone, Instagram, Youtube } from 'lucide-react';
import Image from 'next/image';

interface Settings {
    instagram_url?: string;
    youtube_url?: string;
    email?: string;
    phone?: string;
    address?: string;
    brand_name?: string;
    description?: string;
}

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState<Settings>({});
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const socials = [
        { name: 'Instagram', url: settings.instagram_url, icon: Instagram },
        { name: 'YouTube', url: settings.youtube_url, icon: Youtube },
    ].filter(social => social.url);

    // Default values if settings not loaded
    const brandName = settings.brand_name || 'Silk Thread Boutique';
    const description = settings.description || 'Handcrafted elegance tailored to your unique style.';
    const phone = settings.phone || '';
    const email = settings.email || '';
    const address = settings.address || '';

    return (
        <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
            <div className="sizer py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="block relative h-16 w-48">
                            <Image
                                src="/logo/black-hoz-removebg-preview.png"
                                alt={brandName}
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs text-neutral-400">
                            {description}
                        </p>
                        {socials.length > 0 && (
                            <div className="flex gap-4">
                                {socials.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:bg-secondary hover:text-white transition-all duration-300"
                                        aria-label={social.name}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-display text-lg mb-6 tracking-wide">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm hover:text-secondary transition-colors duration-200 block w-fit"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-display text-lg mb-6 tracking-wide">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            {address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-secondary shrink-0" />
                                    <span className="text-neutral-400">{address}</span>
                                </li>
                            )}
                            {phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-secondary shrink-0" />
                                    <a
                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                        className="hover:text-white transition-colors"
                                    >
                                        {phone}
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-secondary shrink-0" />
                                    <a
                                        href={`mailto:${email}`}
                                        className="hover:text-white transition-colors"
                                    >
                                        {email}
                                    </a>
                                </li>
                            )}
                            {!address && !phone && !email && !isLoading && (
                                <li className="text-neutral-500 text-sm">Contact info coming soon</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-neutral-900 bg-black/20">
                <div className="sizer py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                    <p>© {currentYear} {brandName}. All rights reserved.</p>
                    <p>
                        Developed by{' '}
                        <a
                            href="https://lernexia.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:underline font-medium"
                        >
                            Lernexia
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
