import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from "@tomphttp/bare-server-node";

logging.set_level(logging.NONE);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bareServer = createBareServer("/bare/");
const fastify = Fastify({
  trustProxy: true,
  serverFactory: (handler) => createServer()
    .on("request", (req, res) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      if (bareServer.shouldRoute(req)) {
        void bareServer.routeRequest(req, res);
        return;
      }
      handler(req, res);
    })
    .on("upgrade", (req, socket, head) => {
      if (req.headers.upgrade?.toLowerCase() !== "websocket") return socket.end();
      if (bareServer.shouldRoute(req)) bareServer.routeUpgrade(req, socket, head);
      else wisp.routeRequest(req, socket, head);
    }),
});

fastify.register(fastifyStatic, { root, prefix: "/", decorateReply: true });
fastify.register(fastifyStatic, { root: path.join(root, "proxy-assets"), prefix: "/proxy-assets/", decorateReply: false });
fastify.register(fastifyStatic, { root: epoxyPath, prefix: "/epoxy/", decorateReply: false });
fastify.register(fastifyStatic, {
  root: path.join(root, "node_modules/@mercuryworkshop/bare-as-module3/dist"),
  prefix: "/baremod/",
  decorateReply: false,
});
fastify.register(fastifyStatic, {
  root: path.join(root, "node_modules/@mercuryworkshop/libcurl-transport/dist"),
  prefix: "/libcurl/",
  decorateReply: false,
});
fastify.register(fastifyStatic, { root: baremuxPath, prefix: "/baremux/", decorateReply: false });
fastify.addHook("onSend", async (request, reply, payload) => {
  if (request.url.startsWith("/proxy-assets/ultraworker.js")) {
    reply.header("Service-Worker-Allowed", "/");
  }
  return payload;
});

if (process.env.VERCEL !== "1") {
  fastify.listen({ port: Number(process.env.PORT || 4040), host: "0.0.0.0" })
    .then(() => console.log("CheddarOS proxy listening on port 4040"))
    .catch((error) => { console.error(error); process.exit(1); });
}

export { fastify };
