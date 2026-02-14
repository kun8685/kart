import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center py-10 w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;
