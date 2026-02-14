import React from 'react';
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
                        <li><a href="#" className="hover:underline text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:underline text-white">About Us</a></li>
                        <li><a href="#" className="hover:underline text-white">Careers</a></li>
                        <li><a href="#" className="hover:underline text-white">Gaurykart Stories</a></li>
                        <li><a href="#" className="hover:underline text-white">Press</a></li>
                        <li><a href="#" className="hover:underline text-white">Corporate Information</a></li>
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Help</h6>
                    <ul className="space-y-2 text-xs font-medium">
                        <li><a href="#" className="hover:underline text-white">Payments</a></li>
                        <li><a href="#" className="hover:underline text-white">Shipping</a></li>
                        <li><a href="#" className="hover:underline text-white">Cancellation & Returns</a></li>
                        <li><a href="#" className="hover:underline text-white">FAQ</a></li>
                        <li><a href="#" className="hover:underline text-white">Report Infringement</a></li>
                    </ul>
                </div>

                {/* Consumer Policy */}
                <div>
                    <h6 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wide">Consumer Policy</h6>
                    <ul className="space-y-2 text-xs font-medium">
                        <li><a href="#" className="hover:underline text-white">Return Policy</a></li>
                        <li><a href="#" className="hover:underline text-white">Terms of Use</a></li>
                        <li><a href="#" className="hover:underline text-white">Security</a></li>
                        <li><a href="#" className="hover:underline text-white">Privacy</a></li>
                        <li><a href="#" className="hover:underline text-white">Sitemap</a></li>
                        <li><a href="#" className="hover:underline text-white">EPR Compliance</a></li>
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
                    <p className="text-xs leading-relaxed mb-4">
                        Gaurykart Internet Private Limited,<br />
                        Buildings Alyssa, Begonia &<br />
                        Clove Embassy Tech Village,<br />
                        Outer Ring Road, Devarabeesanahalli Village,<br />
                        Bengaluru, 560103,<br />
                        Karnataka, India
                    </p>
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
