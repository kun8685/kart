const products = [
    {
        name: 'Premium Watch',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
        description: 'Elegant and durable premium watch suitable for all occasions.',
        brand: 'Titan',
        category: 'Accessories',
        price: 2999,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
        variants: []
    },
    {
        name: 'Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        description: 'Noise-cancelling wireless headphones with long battery life.',
        brand: 'Sony',
        category: 'Electronics',
        price: 1599,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
        variants: []
    },
    {
        name: 'Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        description: 'Comfortable running shoes designed for performance.',
        brand: 'Nike',
        category: 'Footwear',
        price: 3499,
        countInStock: 0,
        rating: 4.8,
        numReviews: 25,
        variants: [
            { size: '8', stock: 5, priceOverride: 3499 },
            { size: '9', stock: 5, priceOverride: 3499 },
            { size: '10', stock: 0, priceOverride: 3499 }
        ]
    },
    {
        name: 'Organic Almonds',
        image: 'https://images.unsplash.com/photo-1508061253366-f7da98b47f6d?w=800&q=80',
        description: 'High-quality organic almonds sourced directly from Kashmir.',
        brand: 'GauryNaturals',
        category: 'Food',
        price: 650,
        countInStock: 50,
        rating: 4.8,
        numReviews: 120,
        variants: [
            { size: '250g', stock: 50, priceOverride: 350 },
            { size: '500g', stock: 30, priceOverride: 650 },
            { size: '1kg', stock: 10, priceOverride: 1200 },
        ]
    },
    {
        name: 'Leather Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
        description: 'Genuine leather bag with multiple compartments.',
        brand: 'Hidesign',
        category: 'Fashion',
        price: 4999,
        countInStock: 5,
        rating: 4.2,
        numReviews: 5,
        variants: []
    },
    {
        name: 'Sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        description: 'Stylish sunglasses with UV protection.',
        brand: 'Ray-Ban',
        category: 'Accessories',
        price: 999,
        countInStock: 15,
        rating: 4.6,
        numReviews: 10,
        variants: []
    }
];

module.exports = products;
