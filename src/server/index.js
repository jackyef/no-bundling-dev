Bun.serve({
  routes: {
    "/assets/*": async (req) => {
      const url = new URL(req.url)
      const filePath = `./src/client${url.pathname.replace('/assets', '')}`

      try {
        return new Response(await Bun.file(filePath).bytes(), {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-cache"
          }
        })
      } catch {
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
          </head>
          <body>
            <div id="app"></div>
          </body>
          <script type="importmap">${JSON.stringify({
            imports: await Bun.file('./src/client/dependencies.json').json()
          })}</script>
          <script type="module" src="/assets/index.js"></script>
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
