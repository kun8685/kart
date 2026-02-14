import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { MessageCircle, Phone } from 'lucide-react';
import ChatWidget from './ChatWidget';

const PublicLayout = () => {
    const location = useLocation();
    const isProductPage = location.pathname.startsWith('/product/');

    return (
        <div className={`flex flex-col min-h-screen relative md:pb-0 ${isProductPage ? 'pb-0' : 'pb-16'}`}>
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Chat Widget */}
            <ChatWidget />



            <Footer />
            <MobileNav />
        </div>
    );
};

export default PublicLayout;
