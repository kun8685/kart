import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, RotateCcw, FileText, Info, Phone, AlertTriangle, Heart } from 'lucide-react';

const InfoScreen = () => {
    const { page } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    const contentMap = {
        // ABOUT
        'about': {
            title: 'About Us',
            icon: Info,
            content: (
                <div className="space-y-4 text-gray-600">
                    <p>Welcome to GauryKart, your number one source for all things fashion and lifestyle. We're dedicated to giving you the very best of products, with a focus on dependability, customer service, and uniqueness.</p>
                    <p>Founded in 2024, GauryKart has come a long way from its beginnings. When we first started out, our passion for eco-friendly and affordable fashion drove us to do intense research and gave us the impetus to turn hard work and inspiration into to a booming online store.</p>
                    <p>We now serve customers all over India and are thrilled to be a part of the quirky, eco-friendly, fair trade wing of the fashion industry.</p>
                </div>
            )
        },
        'contact': {
            title: 'Contact Us',
            icon: Phone,
            content: (
                <div className="space-y-6 text-gray-600">
                    <p>We're here to help! Reach out to us through any of the following channels:</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded shadow-sm border">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">Customer Support</h3>
                            <p>Email: info@gaurykart.shop</p>
                            <p>Phone: +91 1800-123-4567</p>
                            <p>Hours: Mon-Sat, 9AM - 8PM</p>
                        </div>
                        <div className="bg-white p-6 rounded shadow-sm border">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">Corporate Office</h3>
                            <p>Gaurykart Internet Private Limited</p>
                            <p>Buildings Alyssa, Begonia & Clove Embassy Tech Village,</p>
                            <p>Outer Ring Road, Bengaluru, 560103</p>
                        </div>
                    </div>
                </div>
            )
        },
        'careers': {
            title: 'Careers',
            icon: Info,
            content: <p className="text-gray-600">Join our team! We are always looking for talented individuals. Send your resume to info@gaurykart.shop.</p>
        },
        'press': {
            title: 'Press Releases',
            icon: FileText,
            content: <p className="text-gray-600">Read the latest news and updates about GauryKart in the media.</p>
        },
        'stories': {
            title: 'Gaurykart Stories',
            icon: Heart,
            content: <p className="text-gray-600">Discover the inspiring stories behind our sellers, artisans, and team members who make Gaurykart special.</p>
        },
        'corporate': {
            title: 'Corporate Information',
            icon: FileText,
            content: (
                <div className="text-gray-600">
                    <p>Gaurykart Internet Private Limited</p>
                    <p>CIN: U72300KA2007PTC041799</p>
                    <p>Registered Office: Buildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India</p>
                </div>
            )
        },

        // HELP
        'payments': {
            title: 'Payments',
            icon: CreditCard,
            content: (
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>We support Credit Cards, Debit Cards, Net Banking, UPI, and Cash on Delivery (COD).</li>
                    <li>All online transactions are secured with 128-bit encryption.</li>
                    <li>For COD orders, a nominal delivery fee may apply for orders below ₹500.</li>
                </ul>
            )
        },
        'shipping': {
            title: 'Shipping',
            icon: Truck,
            content: (
                <div className="text-gray-600 space-y-2">
                    <p>We deliver to over 15,000 pincodes across India.</p>
                    <p>Standard delivery time is 3-5 business days for metro cities and 5-7 days for other regions.</p>
                    <p>You can track your order status in the 'My Orders' section.</p>
                </div>
            )
        },
        'cancellation-returns': {
            title: 'Cancellation & Returns',
            icon: RotateCcw,
            content: (
                <div className="text-gray-600 space-y-4">
                    <p><strong>Cancellations:</strong> You can cancel your order before it is shipped directly from the 'My Orders' page.</p>
                    <p><strong>Returns:</strong> We offer a 7-day hassle-free return policy for most items. Items must be unused and in original packaging.</p>
                </div>
            )
        },
        'faq': {
            title: 'Frequently Asked Questions',
            icon: Info,
            content: (
                <div className="space-y-4">
                    <details className="bg-white p-4 rounded border">
                        <summary className="font-bold cursor-pointer">How do I track my order?</summary>
                        <p className="mt-2 text-gray-600">Go to My Orders and select the order you want to track.</p>
                    </details>
                    <details className="bg-white p-4 rounded border">
                        <summary className="font-bold cursor-pointer">Can I change my address after placing an order?</summary>
                        <p className="mt-2 text-gray-600">No, currently we do not allow address changes once the order is placed to prevent fraud. You can cancel and reorder.</p>
                    </details>
                </div>
            )
        },

        // POLICY
        'return-policy': {
            title: 'Return Policy',
            icon: RotateCcw,
            content: <p className="text-gray-600">Our return policy allows you to return items within 7 days of delivery. <Link to="/info/cancellation-returns" className="text-blue-500">Read more</Link></p>
        },
        'terms': {
            title: 'Terms of Use',
            icon: FileText,
            content: <p className="text-gray-600">By using our website, you agree to comply with our terms of service regarding user conduct, content usage, and liability.</p>
        },
        'security': {
            title: 'Security',
            icon: ShieldCheck,
            content: <p className="text-gray-600">We take security seriously. All your personal data is stored securely and payment information is processed via PCI-DSS compliant gateways.</p>
        },
        'privacy': {
            title: 'Privacy Policy',
            icon: ShieldCheck,
            content: <p className="text-gray-600">We value your privacy. We do not sell your personal data to third parties. We use your data only to improve your shopping experience.</p>
        },
        'infringement': {
            title: 'Report Infringement',
            icon: AlertTriangle,
            content: <p className="text-gray-600">If you believe any content on our site violates your intellectual property rights, please email us at info@gaurykart.shop.</p>
        },
        'epr': {
            title: 'EPR Compliance',
            icon: ShieldCheck,
            content: <p className="text-gray-600">We are committed to the safe disposal of electronic waste. Please drop your e-waste at our designated centers.</p>
        },
        'sitemap': {
            title: 'Sitemap',
            icon: FileText,
            content: <p className="text-gray-600">Explore all the categories, products, and information pages on GauryKart.</p>
        }
    };

    const pageData = contentMap[page] || {
        title: 'Page Not Found',
        icon: AlertTriangle,
        content: <p>The page you are looking for does not exist.</p>
    };

    const Icon = pageData.icon;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header Banner */}
            <div className="bg-primary text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="text-sm opacity-80 mb-2 flex items-center gap-2">
                        <Link to="/" className="hover:underline">Home</Link> /
                        <span className="capitalize text-white font-semibold">{page.replace('-', ' ')}</span>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Icon size={32} /> {pageData.title}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 hidden md:block">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">Help & Settings</div>
                        <ul className="divide-y divide-gray-100 text-sm">
                            <li><Link to="/info/about" className="block p-3 hover:bg-blue-50 hover:text-primary transition">About Us</Link></li>
                            <li><Link to="/info/contact" className="block p-3 hover:bg-blue-50 hover:text-primary transition">Contact Us</Link></li>
                            <li><Link to="/info/faq" className="block p-3 hover:bg-blue-50 hover:text-primary transition">FAQ</Link></li>
                            <li><Link to="/info/return-policy" className="block p-3 hover:bg-blue-50 hover:text-primary transition">Return Policy</Link></li>
                            <li><Link to="/info/terms" className="block p-3 hover:bg-blue-50 hover:text-primary transition">Terms of Use</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            {pageData.content}
                        </div>
                    </div>

                    {/* Feedback / CTA */}
                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full text-blue-500 shadow-sm"><Phone size={24} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800">Need more help?</h4>
                                <p className="text-sm text-gray-600">Our support team is available 24/7.</p>
                            </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-full text-green-500 shadow-sm"><FileText size={24} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800">Track Order</h4>
                                <Link to="/orders" className="text-sm text-green-700 font-bold hover:underline">Check Status &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoScreen;
