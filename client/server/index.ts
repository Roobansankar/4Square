import express from 'express';
import clientRoutes from './routes/clientRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/clients', clientRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
