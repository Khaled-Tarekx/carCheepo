import 'dotenv/config';
import express from 'express';
import connectWithRetry from './src/database/connection.js';
import Redis from 'redis';
import bootstrap from './src/setup/bootstrap.js';
connectWithRetry();
export const client = Redis.createClient({
    url: 'redis://127.0.0.1:6379'
});
const port = process.env.PORT;
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().catch(console.error);
export const createApp = () => {
    let isListening = false;
    const app = express();
    app.use(express.json());
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
