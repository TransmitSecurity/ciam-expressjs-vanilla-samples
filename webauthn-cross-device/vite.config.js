import { defineConfig } from 'vite'
import mixPlugin from 'vite-plugin-mix'

const mix = mixPlugin.default;

export default defineConfig({
  plugins: [
    mix({
      handler: './app.js',
    }),
  ]
})