const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// express-mongo-sanitize v2 is NOT compatible with Express v5 (req.query is read-only in Express 5)
// Using a custom sanitize middleware instead
const sanitizeInput = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach(key => {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            sanitizeInput(obj[key]);
        }
    });
};
const mongoSanitizeMiddleware = (req, res, next) => {
    sanitizeInput(req.body);
    sanitizeInput(req.params);
    next();
};
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import socket.io
const initSocket = require('./utils/socketHandler'); // Import socket handler

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
});

// Pass io to socket handler
initSocket(io);

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(mongoSanitizeMiddleware);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500 // limit each IP to 500 requests per windowMs
});
app.use(limiter);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
// Add chat routes if needed (e.g., getting history via REST), but socket handles real-time.
// Let's add a route to get chat history for initial load.
app.use('/api/chat', require('./routes/chatRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
