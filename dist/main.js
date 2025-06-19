import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectWithRetry from './src/database/connection.js';
import Redis from 'redis';
import bootstrap from './src/setup/bootstrap.js';
connectWithRetry();
export const client = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});
const port = process.env.PORT;
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().catch(console.error);
export const createApp = () => {
    let isListening = false;
    const app = express();
    // Add CORS configuration
    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json({ limit: '10mb' }));
    if (!isListening) {
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`);
            console.log('Swagger UI is available on http://localhost:7500/api-docs');
            isListening = true;
        });
    }
    bootstrap(app);
    return app;
};
createApp();
