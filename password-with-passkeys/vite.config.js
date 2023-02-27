import { defineConfig } from "vite";
import mixPlugin from "vite-plugin-mix";
import dotenv from "dotenv";

dotenv.config();
const mix = mixPlugin.default;

export default defineConfig({
  plugins: [
    mix({
      handler: "./backend/app.js",
    }),
  ],
});
