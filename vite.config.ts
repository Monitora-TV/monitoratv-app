import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import path from 'path';



// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Isso garante que o Buffer estará disponível no seu código
    global: {},
  },
  optimizeDeps: {
    include: ['buffer'],  // Incluir buffer nas dependências do Vite
  },
  plugins: [react()],
  resolve: {
    alias: [
      {find: "@", replacement: path.resolve(__dirname, './src')},
      {find: "@apis", replacement: path.resolve(__dirname, './src/apis')},
      {find: "@auth", replacement: path.resolve(__dirname, './src/auth')},
      {find: "@components", replacement: path.resolve(__dirname, './src/components')},
      {find: "@dashboard", replacement: path.resolve(__dirname, './src/dashboard')},
      {find: "@features", replacement: path.resolve(__dirname, './src/features')},
      {find: "@models", replacement: path.resolve(__dirname, './src/models')},
      {find: "@pages", replacement: path.resolve(__dirname, './src/pages')},
      {find: "@router", replacement: path.resolve(__dirname, './src/router')},
      {find: "@shared-theme", replacement: path.resolve(__dirname, './src/shared-theme')},
      {find: "@styles", replacement: path.resolve(__dirname, './src/styles')},
      {find: "@utils", replacement: path.resolve(__dirname, './src/utils')},
      {find: "@util", replacement: path.resolve(__dirname, './src/util')},
    ],
  },
})



