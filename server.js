import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Root welcome endpoint for pure backend deployments
  app.get('/', (req, res, next) => {
    const indexPath = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return res.json({
      name: "TeaGo Artisanal Cafe Backend API",
      status: "online",
      message: "🍵 TeaGo Backend API is running live on Render!",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        products: "/api/products",
        orders: "/api/orders",
        tables: "/api/tables",
        settings: "/api/settings",
        aiSommelier: "/api/ai/sommelier",
        supabaseConfig: "/api/supabase/config"
      }
    });
  });

  // Mount backend API routes
  app.use('/api', apiRouter);

  if (!isProduction) {
    // Vite Dev Server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if frontend dist exists)
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.resolve(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.json({ status: 'online', message: 'TeaGo Backend API' });
        }
      });
    } else {
      app.get('*', (req, res) => {
        res.json({
          status: 'online',
          message: 'TeaGo Backend API is live. Use /api routes for backend endpoints.'
        });
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍵 TeaGo Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
