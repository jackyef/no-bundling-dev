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

Bun.serve({
  routes: {
    "/assets/style.css": async () => {
      const cssContent = await Bun.file('./src/server/stylesheets/output.css').text()
      
      return new Response(cssContent, {
        headers: {
          "Content-Type": "text/css"
        }
      })
    },
    "/assets/*": async (req) => {
      const url = new URL(req.url)
      const filePath = `./src/client${url.pathname.replace('/assets', '')}`

      try {
        const transpiled = transpiler.transformSync(
          await Bun.file(filePath).text()
        )

        return new Response(`import * as preact from 'preact';\n${transpiled}`, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-cache"
          }
        })
      } catch (error) {
        console.error(`Error serving asset ${filePath}:`, error)
        return new Response("Not Found", { status: 404 })
      }
    },
    "/": async () => {
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
          <script type="importmap">${JSON.stringify({
            imports: await Bun.file('./src/client/dependencies.json').json()
          })}</script>
          <script type="module" src="/assets/index.tsx"></script>
        </html>
        `.trim(), {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache"
        }
      })
    }
  }
})
