import { defineConfig } from 'vite';
import mix from 'vite-plugin-mix';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // load env vars from .env
dotenv.config({ path: './.env', override: true }); // load local env vars from .env

export default defineConfig({
  plugins: [
    mix({
      handler: './backend/app.js',
    }),
  ],
});
