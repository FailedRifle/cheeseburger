import { readFile } from "node:fs/promises";
import path from "node:path";

const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
let allowedGameUrlsPromise;

async function allowedGameUrls() {
  allowedGameUrlsPromise ??= readFile(
    path.join(process.cwd(), "core/json/games.json"),
    "utf8",
  ).then((contents) => new Set(JSON.parse(contents).map((game) => game.url)));
  return allowedGameUrlsPromise;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function htmlResponse(response, status, message) {
  response.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(message);
}

export default async function handler(request, response) {
  const rawUrl = request.query?.url;
  const sourceUrl = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl;

  if (typeof sourceUrl !== "string") {
    htmlResponse(response, 400, "Game URL is required");
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    htmlResponse(response, 400, "Invalid game URL");
    return;
  }

  if (parsedUrl.protocol !== "https:" || !/\.html?$/i.test(parsedUrl.pathname)) {
    htmlResponse(response, 400, "Only catalogued HTTPS HTML games can be loaded here");
    return;
  }

  try {
    if (!(await allowedGameUrls()).has(sourceUrl)) {
      htmlResponse(response, 404, "Game URL is not in the catalog");
      return;
    }

    const upstream = await fetch(sourceUrl, {
      redirect: "follow",
      headers: { accept: "text/html,text/plain;q=0.9,*/*;q=0.1" },
      signal: AbortSignal.timeout(15000),
    });

    if (!upstream.ok) {
      htmlResponse(response, 502, `Game source returned HTTP ${upstream.status}`);
      return;
    }

    const declaredSize = Number(upstream.headers.get("content-length") || 0);
    if (declaredSize > MAX_DOCUMENT_BYTES) {
      htmlResponse(response, 413, "Game document is too large");
      return;
    }

    let documentHtml = Buffer.from(await upstream.arrayBuffer());
    if (documentHtml.length > MAX_DOCUMENT_BYTES) {
      htmlResponse(response, 413, "Game document is too large");
      return;
    }

    let html = documentHtml.toString("utf8");
    const baseTag = `<base href="${escapeAttribute(sourceUrl)}">`;
    if (/<base\b[^>]*>/i.test(html)) {
      html = html.replace(/<base\b[^>]*>/i, baseTag);
    } else if (/<head\b[^>]*>/i.test(html)) {
      html = html.replace(/<head\b[^>]*>/i, (head) => `${head}${baseTag}`);
    } else {
      html = `${baseTag}${html}`;
    }

    // Unity game copies often hard-code rawcdn.githack.com for their payload
    // files. Use the equivalent pinned jsDelivr path so those files keep
    // working in browsers that cannot load the githack host.
    html = html.replace(
      /https:\/\/rawcdn\.githack\.com\/([^/\s"'<>]+)\/([^/\s"'<>]+)\/([^/\s"'<>]+)\//gi,
      "https://cdn.jsdelivr.net/gh/$1/$2@$3/",
    );

    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60, stale-while-revalidate=300",
      "x-content-type-options": "nosniff",
      "cross-origin-resource-policy": "same-origin",
    });
    response.end(html);
  } catch (error) {
    console.error("Could not load game document:", error);
    htmlResponse(response, 502, "Could not load the game document");
  }
}
