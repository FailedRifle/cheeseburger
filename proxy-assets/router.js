// The browser page does not include Ultraviolet's global scripts itself.
// Load them before proxyUV reads the global config when a search is submitted.
import "/proxy-assets/uv/uv.bundle.js";
import "/proxy-assets/uv/uv.config.js";
import {
  makeURL,
  proxySJ,
  proxyUV,
  ensureProxyReady,
  registerSW,
  setTransport,
  setWisp,
  getProxyType,
  getTransportChoice,
} from "/proxy-assets/lithium.mjs?v=8";

const wisp = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;

async function prepareProxy() {
  await setWisp(wisp);
  await setTransport(getTransportChoice());
  await registerSW();
}

export async function configureTransport(transport) {
  await setWisp(wisp);
  await setTransport(transport);
}

window.cheddarProxyOpen = async (input) => {
  await prepareProxy();
  const url = makeURL(input);
  const destinationHost = new URL(url).hostname.toLowerCase();
  const isDuckDuckGo = destinationHost === "duckduckgo.com" || destinationHost.endsWith(".duckduckgo.com");
  // DuckDuckGo rejects searches sent through this site's Vercel Bare Server
  // egress. Keep Bare Server as the saved default, but route DuckDuckGo via
  // the site's Epoxy/Wisp transport for this browsing session.
  if (isDuckDuckGo && getTransportChoice() === "bare") {
    await setTransport("epoxy", { persist: false });
  }
  const selected = getProxyType();
  if (selected === "SJ") {
    await ensureProxyReady();
    return proxySJ(url);
  }

  try {
    return await proxyUV(url);
  } catch (error) {
    console.warn("UV failed; retrying with Scramjet", error);
    await ensureProxyReady();
    return proxySJ(url);
  }
};

// UV creates its proxy URL before the upstream page is fetched, so network
// failures happen after cheddarProxyOpen has returned. Expose an explicit
// Scramjet retry for the browser shell to use when UV renders its error page.
window.cheddarProxyFallback = async (input) => {
  await prepareProxy();
  await ensureProxyReady();
  return proxySJ(makeURL(input));
};

window.addEventListener("load", () => {
  prepareProxy().catch((error) => console.warn("Proxy startup deferred", error));
});
