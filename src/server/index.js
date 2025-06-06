const isProduction = process.env.NODE_ENV === 'production';
const transpiler = new Bun.Transpiler({ 
  loader: 'jsx', 
  target: 'browser',
  tsconfig: {
    compilerOptions: {
      jsx: 'react',
      jsxFactory: 'preact.h',
    }
  }
})

const serverBootupTimestamp = Date.now();
const simpleCacheHeaders = isProduction ? {
  "ETag": `W/${serverBootupTimestamp}`,
  "Cache-Control": "public, max-age=31536000"
} : {
  "Cache-Control": "no-cache, no-store",
}

// Simple cache to avoid repeated transpilation in production.
const cachedAssets = new Map();

Bun.serve({
  port: 3000,
  development: !isProduction,
  routes: {
    // Health checks
    "/health": new Response("OK"),
    "/assets/style.css": async () => {
      const cssContent = 
        cachedAssets.get('./src/server/stylesheets/output.css') || 
        await Bun.file('./src/server/stylesheets/output.css').text()
      

    if (isProduction) {
      cachedAssets.set('./src/server/stylesheets/output.css', cssContent);
    }

      return new Response(cssContent, {
        headers: {
          "Content-Type": "text/css",
          ...simpleCacheHeaders
        }
      })
    },
    "/assets/*": async (req) => {
      const url = new URL(req.url)
      const filePath = `./src/client${url.pathname.replace('/assets', '')}`

      if (cachedAssets.has(filePath)) {
        return new Response(cachedAssets.get(filePath), {
          headers: {
            "Content-Type": "application/javascript",
            ...simpleCacheHeaders
          }
        })
      }
      
      try {
        const transpiled = transpiler.transformSync(
          await Bun.file(filePath).text()
        )
        const output = `import * as preact from 'preact';\n${transpiled}`
        
        if (isProduction) {
          cachedAssets.set(filePath, output);
        }

        return new Response(output, {
          headers: {
            "Content-Type": "application/javascript",
            ...simpleCacheHeaders
          }
        })
      } catch (error) {
        console.error(`Error serving asset ${filePath}:`, error)
        return new Response("Not Found", { status: 404 })
      }
    },
    "/": async () => {
      const importMap = cachedAssets.get('./src/client/dependencies.json')
        || JSON.stringify({
          imports: await Bun.file('./src/client/dependencies.json').json()
        })

      if (isProduction) {
        cachedAssets.set('./src/client/dependencies.json', importMap);
      }

      return new Response(`
        <!DOCTYPE html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>no-bundle-development</title>
            <link rel="stylesheet" href="/assets/style.css">
          </head>
          <body>
            <div id="app"></div>
          </body>
          <script type="importmap">${importMap}</script>
          <script type="module" src="/assets/index.tsx"></script>
        </html>
        `.trim(), 
        {
          headers: {
            "Content-Type": "text/html",
            ...simpleCacheHeaders
          }
        }
      )
    }
  },
  fetch(req) {
    console.log('Request received:', req.method, req.url);
    // Fallback for any unmatched routes
    return new Response("404!");
  },
})

console.log(`Server listening on port 3000`)
