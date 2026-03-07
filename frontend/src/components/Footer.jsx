import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4rem 0 2rem 0',
            marginTop: 'auto',
            color: '#cbd5e1',
            zIndex: 10,
            position: 'relative',
            textAlign: 'left'
        }}>
            <div className="container mx-auto px-6 max-w-7xl">
                {/* About Us / The Story */}
                <div className="mb-16 text-center max-w-4xl mx-auto" style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
                }}>
                    <h2 className="text-3xl font-bold mb-6" style={{
                        background: 'linear-gradient(to right, #60a5fa, #c084fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        Your Entire World, Simplified.
                    </h2>
                    <p className="mb-6 opacity-90 leading-relaxed text-lg" style={{ textAlign: 'center' }}>
                        At Buy2Enjoy, we believe your time is your most valuable asset. We grew tired of juggling a dozen different tabs and apps just to manage our daily lives—so we built a better way.
                    </p>
                    <p className="mb-6 opacity-90 leading-relaxed text-lg" style={{ textAlign: 'center' }}>
                        We have designed a single, seamless universe where your everyday needs meet global exploration. Whether you are restocking your pantry with fresh groceries, tracking a live express train across the country, or securely consulting with a top-tier doctor, our platform brings the world directly to your fingertips.
                    </p>
                    <p className="m-0 font-bold text-[#60a5fa] leading-relaxed text-lg" style={{ textAlign: 'center' }}>
                        No more switching between screens. From upgrading your electronics to booking your next great adventure, Buy2Enjoy is built to move at the speed of your life.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-bold text-white mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Buy2Enjoy</h3>
                        <p className="mb-6 opacity-80 leading-relaxed text-sm">
                            Your entire world, simplified. From everyday essentials to next-gen electronics, live travel bookings,
                            and secure healthcare consults—all in one seamless, unified platform.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors duration-300"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors duration-300"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors duration-300"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors duration-300"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm" style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/" className="hover:text-[#60a5fa] transition-colors duration-300">Shop Limitless</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/booking" className="hover:text-[#60a5fa] transition-colors duration-300">Live Travel Booking</Link></li>
                            <li style={{ marginBottom: '0.75rem' }}><Link to="/health" className="hover:text-[#34d399] transition-colors duration-300">Health First</Link></li>
                            <li><Link to="/wallet" className="hover:text-[#a78bfa] transition-colors duration-300">Universal Wallet</Link></li>
                        </ul>
                    </div>

                    {/* Support & Policies */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Support</h4>
                        <ul className="space-y-3 text-sm" style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.75rem' }}><a href="#" className="hover:text-white transition-colors duration-300">Help Center / FAQ</a></li>
                            <li style={{ marginBottom: '0.75rem' }}><a href="#" className="hover:text-white transition-colors duration-300">Track Order / Booking</a></li>
                            <li style={{ marginBottom: '0.75rem' }}><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-4 text-sm" style={{ listStyle: 'none', padding: 0 }}>
                            <li className="flex items-start gap-3" style={{ marginBottom: '1rem', alignItems: 'center' }}>
                                <MapPin size={18} className="text-[#f472b6] shrink-0" style={{ marginRight: '8px' }} />
                                <span>123 Innovation Drive, Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center gap-3" style={{ marginBottom: '1rem', alignItems: 'center' }}>
                                <Phone size={18} className="text-[#f472b6] shrink-0" style={{ marginRight: '8px' }} />
                                <span>+1 (800) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3" style={{ alignItems: 'center' }}>
                                <Mail size={18} className="text-[#f472b6] shrink-0" style={{ marginRight: '8px' }} />
                                <span>support@buy2enjoy.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70">
                    <p className="m-0">&copy; {currentYear} Buy2Enjoy. All Rights Reserved.</p>
                    <p className="m-0">Built with MERN & Socket.io</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
