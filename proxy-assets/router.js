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
} from "/proxy-assets/lithium.mjs?v=6";

const wisp = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;

async function prepareProxy() {
  // Older builds persisted Libcurl, which can hang on restricted networks.
  // Migrate that stale selection to the working bundled transport once.
  await setTransport("epoxy");
  await setWisp(wisp);
  await registerSW();
}

window.cheddarProxyOpen = async (input) => {
  await prepareProxy();
  const url = makeURL(input);
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

window.addEventListener("load", () => {
  prepareProxy().catch((error) => console.warn("Proxy startup deferred", error));
});
