import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function userGuideAssets() {
  const guideRoot = path.resolve(__dirname, '../09_User_Guide')
  let outputDirectory = path.resolve(__dirname, 'dist')
  const mimeTypes: Record<string, string> = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  }

  const serveGuide = (req, res, next) => {
    if (!req.url) return next()

    const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    if (!requestPath.startsWith('/user-guide/')) return next()

    const relativePath = requestPath.slice('/user-guide/'.length) || 'index.html'
    const filePath = path.resolve(guideRoot, relativePath)
    if (filePath !== guideRoot && !filePath.startsWith(`${guideRoot}${path.sep}`)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        res.statusCode = 404
        res.end('User Guide file not found')
        return
      }

      res.setHeader('Content-Type', mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream')
      res.setHeader('Cache-Control', 'no-cache')
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      fs.createReadStream(filePath).pipe(res)
    })
  }

  return {
    name: 'user-guide-assets',
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use(serveGuide)
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveGuide)
    },
    closeBundle() {
      fs.cpSync(guideRoot, path.join(outputDirectory, 'user-guide'), { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    userGuideAssets(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
