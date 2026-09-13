import { fastify } from "../src/index.js";

// Vercel's Node runtime accepts a native HTTP server for WebSocket-capable
// functions. The server is initialized once per warm function instance.
await fastify.ready();

export default fastify.server;
