import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import keywordRoutes from './routes/keywordRoutes';

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Keyword app listening on port ${port}!`));

server.keepAliveTimeout = 300 * 1000;
server.headersTimeout = 300 * 1000;
server.timeout = 300 * 1000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', keywordRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});