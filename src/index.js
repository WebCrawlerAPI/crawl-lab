import express from 'express';
import { setupRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupRoutes(app);

app.listen(PORT, () => {
  console.log(`Scraper Tester server running on port ${PORT}`);
});
