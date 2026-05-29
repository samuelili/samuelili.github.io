import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'github-pages-spa',
      closeBundle() {
        const src = path.resolve(__dirname, 'dist/index.html')
        const dest = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest)
        }
      }
    },
    {
      name: 'serve-flora-static',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/flora' || req.url === '/flora/') {
            req.url = '/flora/index.html';
          }
          next();
        });
      }
    }
  ],
})
