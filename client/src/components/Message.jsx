import React from 'react';

const Message = ({ variant = 'info', children }) => {
    let styles = '';

    switch (variant) {
        case 'danger':
            styles = 'bg-red-100 border-red-400 text-red-700';
            break;
        case 'success':
            styles = 'bg-green-100 border-green-400 text-green-700';
            break;
        case 'warning':
            styles = 'bg-yellow-100 border-yellow-400 text-yellow-700';
            break;
        default:
            styles = 'bg-blue-100 border-blue-400 text-blue-700';
    }

    return (
        <div className={`border px-4 py-3 rounded relative mb-4 ${styles}`} role="alert">
            <span className="block sm:inline">{children}</span>
        </div>
    );
};

export default Message;
