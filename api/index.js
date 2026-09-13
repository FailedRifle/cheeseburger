import { fastify } from "../src/index.js";

let ready;

export default async function handler(request, response) {
  ready ??= fastify.ready();
  await ready;
  fastify.server.emit("request", request, response);
}
