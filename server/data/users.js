const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '9999999999',
        password: 'password123', // Will be hashed by pre-save hook
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'password123',
        isAdmin: false,
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '8765432109',
        password: 'password123',
        isAdmin: false,
    },
];

module.exports = users;
