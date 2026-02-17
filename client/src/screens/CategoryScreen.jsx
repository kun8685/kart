import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

const CategoryScreen = () => {
    const categories = [
        {
            name: 'Electronics',
            img: 'https://rukminim1.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100',
            desc: 'Mobiles, Laptops, Gadgets',
            color: 'bg-blue-50 text-blue-800'
        },
        {
            name: 'Fashion',
            img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100',
            desc: 'Trends, Clothing, Style',
            color: 'bg-pink-50 text-pink-800'
        },
        {
            name: 'Footwear',
            img: 'https://cdn-icons-png.flaticon.com/128/2589/2589903.png',
            desc: 'Sneakers, Formal, Casual',
            color: 'bg-orange-50 text-orange-800'
        },
        {
            name: 'Beauty & Personal Care',
            img: 'https://rukminim1.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100',
            desc: 'Skincare, Makeup, Grooming',
            color: 'bg-purple-50 text-purple-800'
        },
        {
            name: 'Home & Appliances',
            img: 'https://rukminim1.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg?q=100',
            desc: 'Furniture, Decor, Tools',
            color: 'bg-green-50 text-green-800'
        },
        {
            name: 'Sports & Fitness',
            img: 'https://cdn-icons-png.flaticon.com/128/2964/2964514.png',
            desc: 'Gym, Outdoor, Equipment',
            color: 'bg-teal-50 text-teal-800'
        },
        {
            name: 'Toys & Baby',
            img: 'https://cdn-icons-png.flaticon.com/128/3081/3081329.png',
            desc: 'Kids, Games, Learning',
            color: 'bg-yellow-50 text-yellow-800'
        },
        {
            name: 'Books',
            img: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png',
            desc: 'Fiction, Academic, Non-Fiction',
            color: 'bg-indigo-50 text-indigo-800'
        },
        {
            name: 'Grocery',
            img: 'https://rukminim1.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png?q=100',
            desc: 'Daily Staples, Snacks',
            color: 'bg-red-50 text-red-800'
        },
        {
            name: 'Accessories',
            img: 'https://cdn-icons-png.flaticon.com/128/2919/2919722.png',
            desc: 'Bags, Watches, Belts',
            color: 'bg-gray-50 text-gray-800'
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-24 pt-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Explore Categories</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">Find everything you need, organized just for you.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            to={`/search/${cat.name}`}
                            key={index}
                            className="relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block group border border-gray-100"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 transition-transform group-hover:scale-150 duration-500 ${cat.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>

                            <div className="p-5 flex flex-col h-full items-center text-center">
                                <div className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                    <img src={cat.img} alt={cat.name} className="w-14 h-14 object-contain" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors line-clamp-1 w-full">{cat.name}</h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-4 w-full">{cat.desc}</p>

                                <div className="mt-auto w-full">
                                    <span className="inline-flex items-center justify-center w-full py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        Explore Now <ArrowRight size={14} className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryScreen;
