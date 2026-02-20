import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="border border-gray-100 rounded-sm p-4 w-full h-full flex flex-col bg-white animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-40 bg-gray-200 rounded-md mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 background-animate"></div>

            {/* Brand Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>

            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

            {/* Rating Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>

            {/* Price Skeleton */}
            <div className="flex gap-2 mt-auto pt-2">
                <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
};

export const HomeSkeleton = () => {
    return (
        <div className="bg-[#f1f2f4] min-h-screen pb-8 w-full animate-pulse">
            {/* Categories Skeleton */}
            <div className="bg-white shadow-sm mb-3 py-3">
                <div className="container mx-auto px-4 flex justify-center gap-4 md:gap-12 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-200"></div>
                            <div className="h-2 w-10 md:w-14 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Banner Skeleton */}
            <div className="container mx-auto px-2 mb-3">
                <div className="w-full h-[150px] sm:h-[200px] md:h-[280px] bg-gray-300 rounded-sm shadow-sm"></div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="container mx-auto px-2 md:px-3">
                <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                    <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
                        {[...Array(6)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
