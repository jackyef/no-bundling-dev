import { isProduction } from "./constants";
import { routes } from "./routes";


Bun.serve({
  port: 3000,
  development: !isProduction,
  routes: routes,
  fetch(req) {
    const pathname = new URL(req.url).pathname;
    let handler = routes[pathname]

    if (!handler && pathname.startsWith('/assets/')) {
      // Handle assets with a wildcard route
      handler = routes['/assets/*'];
    }

    // Fallback for any unmatched routes
    if (handler) {
      return handler(req);
    }

    return new Response("404!");
  },
})

console.log(`Server listening on port 3000`)
