import { defineConfig } from 'vite';
import mixPlugin from 'vite-plugin-mix';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // load env vars from .env
const mix = mixPlugin.default;

export default defineConfig({
  plugins: [
    mix({
      handler: './backend/app.js',
    }),
  ],
  server: {
    port: process.env.PORT || 8080,
  },
});
