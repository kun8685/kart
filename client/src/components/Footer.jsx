import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, MapPin, Mail, Phone, ShoppingBag } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#172337] text-white text-sm font-sans border-t border-gray-200">
            {/* Main Footer Links */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* About */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">About</h6>
                    <ul className="space-y-2 text-xs font-medium">
                        <li><Link to="/info/contact" className="hover:underline text-white">Contact Us</Link></li>
                        <li><Link to="/info/about" className="hover:underline text-white">About Us</Link></li>
                        <li><Link to="/info/careers" className="hover:underline text-white">Careers</Link></li>
                        <li><Link to="/info/stories" className="hover:underline text-white">Gaurykart Stories</Link></li>
                        <li><Link to="/info/press" className="hover:underline text-white">Press</Link></li>
                        <li><Link to="/info/corporate" className="hover:underline text-white">Corporate Information</Link></li>
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Help</h6>
                    <ul className="space-y-2 text-xs font-medium">
                        <li><Link to="/info/payments" className="hover:underline text-white">Payments</Link></li>
                        <li><Link to="/info/shipping" className="hover:underline text-white">Shipping</Link></li>
                        <li><Link to="/info/cancellation-returns" className="hover:underline text-white">Cancellation & Returns</Link></li>
                        <li><Link to="/info/faq" className="hover:underline text-white">FAQ</Link></li>
                        <li><Link to="/info/infringement" className="hover:underline text-white">Report Infringement</Link></li>
                    </ul>
                </div>

                {/* Consumer Policy */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Consumer Policy</h6>
                    <ul className="space-y-2 text-xs font-medium">
                        <li><Link to="/info/return-policy" className="hover:underline text-white">Return Policy</Link></li>
                        <li><Link to="/info/terms" className="hover:underline text-white">Terms of Use</Link></li>
                        <li><Link to="/info/security" className="hover:underline text-white">Security</Link></li>
                        <li><Link to="/info/privacy" className="hover:underline text-white">Privacy</Link></li>
                        <li><Link to="/info/sitemap" className="hover:underline text-white">Sitemap</Link></li>
                        <li><Link to="/info/epr" className="hover:underline text-white">EPR Compliance</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Social</h6>
                    <div className="flex space-x-4 mb-6">
                        <a href="#" className="hover:text-blue-500"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-blue-400"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-pink-500"><Instagram size={20} /></a>
                    </div>

                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Mail Us:</h6>
                    <address className="text-xs leading-relaxed mb-4 not-italic">
                        Gaurykart Internet Private Limited,<br />
                        Buildings Alyssa, Begonia &<br />
                        Clove Embassy Tech Village,<br />
                        Outer Ring Road, Devarabeesanahalli Village,<br />
                        Bengaluru, 560103,<br />
                        Karnataka, India
                    </address>
                </div>
            </div>

            {/* Bottom Strip */}
            <div className="border-t border-gray-600">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="text-yellow-400" size={20} />
                        <span className="text-base font-bold italic">Gaury<span className="text-yellow-400">kart</span></span>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-white">
                        <span className="flex items-center gap-1"><span className="text-yellow-400"><Heart size={14} fill="currentColor" /></span> Advertise</span>
                        <span className="flex items-center gap-1"><span className="text-yellow-400"><Heart size={14} fill="currentColor" /></span> Gift Cards</span>
                        <span className="flex items-center gap-1"><span className="text-yellow-400"><Heart size={14} fill="currentColor" /></span> Help Center</span>
                    </div>

                    <div className="text-xs text-gray-400">
                        &copy; 2024-2025 Gaurykart.com
                    </div>

                    <div className="flex items-center gap-2">
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg" alt="Payment Methods" className="h-4" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
