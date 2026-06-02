import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import regionsRouter from './routes/regions';
import predictionsRouter from './routes/predictions';
import solutionsRouter from './routes/solutions';
import chatRouter from './routes/chat';
import causesRouter from './routes/causes';
import landmarketRouter from './routes/landmarket';
import mlRoutes from './routes/mlPrediction.routes';

// Load .env from every path that exists (covers backend/ cwd, monorepo root, dist vs src)
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend', '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/regions', regionsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/solutions', solutionsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/causes', causesRouter);
app.use('/api/land-market', landmarketRouter);
app.use('/api/ml', mlRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
