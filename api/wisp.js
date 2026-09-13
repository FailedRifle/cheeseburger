import { fastify } from "../src/index.js";

// Vercel's WebSocket beta accepts a native HTTP server export for this
// dedicated upgrade route. The HTTP handler remains in api/index.js.
await fastify.ready();

export default fastify.server;
