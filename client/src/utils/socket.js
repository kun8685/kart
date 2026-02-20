import { io } from 'socket.io-client';

// Use relative path for production to use same origin as client (handled by proxy or same server)
// For dev, it can still use the env var or default
const ENDPOINT = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const getSocket = () => {
    return io(ENDPOINT, {
        path: '/socket.io', // Standard socket.io path
        reconnection: true,
        secure: true,
    });
};
