const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
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
        origin: "*", // Allow all origins for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Pass io to socket handler
initSocket(io);

// Security Middleware
// app.use(helmet());
app.use(express.json());
app.use(cors());
// app.use(mongoSanitize());
// app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500 // limit each IP to 500 requests per windowMs
});
// app.use(limiter);

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
// Add chat routes if needed (e.g., getting history via REST), but socket handles real-time.
// Let's add a route to get chat history for initial load.
app.use('/api/chat', require('./routes/chatRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
