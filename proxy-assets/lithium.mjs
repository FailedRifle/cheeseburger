//////////////////////////////
///          Init          ///
//////////////////////////////
// Use the browser bundle here; the server package exposes bare Node imports
// that browsers cannot resolve (which would stop every proxy page module).
import { BareMuxConnection } from "/baremux/index.mjs";
//////////////////////////////
///         Options        ///
//////////////////////////////
const connection = new BareMuxConnection("/baremux/worker.js?v=2");

let wispURL;
let transportURL;

export let tabCounter = 0;
export let currentTab = 0;
export let framesElement;
export let currentFrame;
export const addressInput = document.getElementById("address");

let scramjet;
let scramjetReady;

async function initializeScramjet() {
  if (scramjet) return scramjet;
  if (!scramjetReady) scramjetReady = (async () => {
  await import(`/proxy-assets/scram/scramjet.all.js`);

  const { ScramjetController } = window.$scramjetLoadController();
  const createController = () => new ScramjetController({
      files: {
        wasm: `/proxy-assets/scram/scramjet.wasm.wasm`,
        all: `/proxy-assets/scram/scramjet.all.js`,
        sync: `/proxy-assets/scram/scramjet.sync.js`,
        prefix: "/proxy-assets/scramjet/",
      },
      siteFlags: {
        "https://www.google.com/(search|sorry).*": {
          naiiveRewriter: true,
        },
      },
    });

  scramjet = createController();
  try {
    await scramjet.init();
  } catch (error) {
    // A previous deployment can leave the Scramjet IDB schema half-created.
    // Reset only Scramjet's own database, then initialize once more.
    if (error?.name !== "NotFoundError") throw error;
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("$scramjet");
      request.onsuccess = request.onerror = request.onblocked = resolve;
      request.onerror = () => reject(request.error);
    });
    scramjet = createController();
    await scramjet.init();
  }
  window.scramjet = scramjet;
  return scramjet;
  })();
  return scramjetReady;
}
const transportOptions = {
  // BareMux's CDN worker evaluates transport imports from an about:blank
  // worker context, so root-relative URLs cannot be resolved there.
  epoxy: `${location.origin}/epoxy/index.mjs`,
  libcurl: `${location.origin}/libcurl/index.mjs`,
};

//////////////////////////////
///           SW           ///
//////////////////////////////
// The combined worker owns the root scope so both UV and Scramjet work in
// every browser tab. It loads the canonical /uv and /scram asset trees.
const stockSW = "/proxy-assets/ultraworker.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Registers the service worker if supported and allowed.
 * @returns {Promise<void>}
 * @throws Will throw if service workers are unsupported or not HTTPS on disallowed hosts.
 */
export async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

  const registration = await navigator.serviceWorker.register(stockSW, { scope: "/" });
  // `ready` means the worker is active, but an already-open page can still be
  // controlled by the previous worker (or no worker) until `controllerchange`.
  // Wait before navigating an iframe, or the first proxy URL goes to Vercel as
  // an ordinary static request and returns a 404.
  await navigator.serviceWorker.ready;
  if (navigator.serviceWorker.controller !== registration.active) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 5000);
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  }
  if (navigator.serviceWorker.controller !== registration.active) {
    throw new Error("The proxy Service Worker is active but has not taken control of this page yet. Reload and try again.");
  }
}

export async function ensureProxyReady() {
  await Promise.all([registerSW(), initializeScramjet()]);
}

if (window.self === window.top) {
  registerSW()
    .then(() => console.log("lethal.js: Service Worker registered"))
    .catch((err) => console.error("lethal.js: Service Worker registration failed:", err));
}

//////////////////////////////
///        Functions       ///
//////////////////////////////

/**
 * Creates a valid URL from input or returns a search URL.
 * @param {string} input - The input string or URL.
 * @param {string} [template="https://search.brave.com/search?q=%s"] - Search URL template.
 * @returns {string} Valid URL string.
 */
// Store the search engine template
localStorage.setItem("searchEngine", "https://duckduckgo.com/?q=%s");

// Function to make a URL
export function makeURL(input, template) {
  // Use the template from argument or localStorage
  template = template || localStorage.getItem("searchEngine");

  try {
    // Try treating the input as a URL
    return new URL(input).toString();
  } catch (err) {
    // If invalid URL, treat as search query
    return template.replace("%s", encodeURIComponent(input));
  }
}

/**
 * Updates BareMux connection with current transport and wisp URLs.
 * @returns {Promise<void>}
 */
async function updateBareMux() {
  if (transportURL != null && wispURL != null) {
    console.log(
      `lethal.js: Setting BareMux to ${transportURL} and Wisp to ${wispURL}`
    );
    await connection.setTransport(transportURL, [{ wisp: wispURL }]);
  }
}

/**
 * Sets the transport URL and updates BareMux.
 * @param {string} transport - Transport name or URL.
 * @returns {Promise<void>}
 */
export async function setTransport(transport) {
  console.log(`lethal.js: Setting transport to ${transport}`);
  localStorage.setItem("transport", transport);
  localStorage.setItem("transportType", transport);
  transportURL = transportOptions[transport] || transport;
  await updateBareMux();
}

export function getProxyType() {
  const selected = localStorage.getItem("proxyType");
  if (selected === "UV" || selected === "SJ" || selected === "Auto") return selected;
  if (localStorage.getItem("proxy-backend") === "scramjet") return "SJ";
  return "UV";
}

/**
 * Gets the current transport URL.
 * @returns {string | undefined}
 */
export function getTransport() {
  return transportURL;
}

/**
 * Sets the wisp URL and updates BareMux.
 * @param {string} wisp - Wisp URL.
 * @returns {Promise<void>}
 */
export async function setWisp(wisp) {
  console.log(`lethal.js: Setting Wisp to ${wisp}`);
  wispURL = wisp;
  await updateBareMux();
}

/**
 * Gets the current wisp URL.
 * @returns {string | undefined}
 */
export function getWisp() {
  return wispURL;
}

/**
 * Gets the proxied URL
 * @param {string} input - The input URL or hostname.
 * @returns {Promise<string>}
 */
export async function proxySJ(input) {
  await ensureProxyReady();
  const url = makeURL(input);
  return scramjet.encodeUrl(url);
}
export async function proxyUV(input) {
  await registerSW();
  const url = makeURL(input);
    return __uv$config.prefix + __uv$config.encodeUrl(url);
}

/**
 * Sets the container element for frames.
 * @param {HTMLElement} frames - The frames container element.
 */
export function setFrames(frames) {
  framesElement = frames;
}

/**
 * Class representing a browser tab with its own iframe.
 */
export class Tab {
  /**
   * Creates a new tab with an iframe and appends it to frames container.
   */
  constructor() {
    tabCounter++;
    this.tabNumber = tabCounter;

    this.frame = document.createElement("iframe");
    this.frame.setAttribute("class", "w-full h-full border-0 fixed");
    this.frame.setAttribute("title", "Proxy Frame");
    this.frame.setAttribute("src", "/newtab");
    this.frame.setAttribute("loading", "lazy"); 
    this.frame.setAttribute("id", `frame-${tabCounter}`);
    framesElement.appendChild(this.frame);

    this.switch();

    this.frame.addEventListener("load", () => this.handleLoad());

    document.dispatchEvent(
      new CustomEvent("new-tab", {
        detail: { tabNumber: tabCounter },
      })
    );
  }

  /**
   * Switches to this tab, hiding other iframes and updating the address input.
   */
  switch() {
    currentTab = this.tabNumber;
    const frames = document.querySelectorAll("iframe");
    [...frames].forEach((frame) => frame.classList.add("hidden"));
    this.frame.classList.remove("hidden");

    currentFrame = document.getElementById(`frame-${this.tabNumber}`);

    addressInput.value = decodeURIComponent(
      this.frame?.contentWindow?.location.href.split("/").pop()
    );

    document.dispatchEvent(
      new CustomEvent("switch-tab", {
        detail: { tabNumber: this.tabNumber },
      })
    );
  }

  /**
   * Closes this tab by removing its iframe and dispatching a close event.
   */
  close() {
    this.frame.remove();

    document.dispatchEvent(
      new CustomEvent("close-tab", {
        detail: { tabNumber: this.tabNumber },
      })
    );
  }

  /**
   * Handles iframe load event: updates history and address input.
   */
  handleLoad() {
    let url = decodeURIComponent(
      this.frame?.contentWindow?.location.href.split("/").pop()
    );
    let title = this.frame?.contentWindow?.document.title;

    let history = localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history"))
      : [];
    history = [...history, { url, title }];
    localStorage.setItem("history", JSON.stringify(history));

    document.dispatchEvent(
      new CustomEvent("url-changed", {
        detail: { tabId: currentTab, title, url },
      })
    );

    if (url === "newtab") url = "bromine://newtab";
    addressInput.value = url;
  }
}

/**
 * Creates a new tab.
 * @returns {Promise<void>}
 */
export async function newTab() {
  new Tab();
}

/**
 * Switches to the specified tab number.
 * @param {number} tabNumber - Tab number to switch to.
 */
export function switchTab(tabNumber) {
  const frames = document.querySelectorAll("iframe");
  [...frames].forEach((frame) => {
    frame.classList.toggle("hidden", frame.id !== `frame-${tabNumber}`);
  });

  currentTab = tabNumber;
  currentFrame = document.getElementById(`frame-${tabNumber}`);

  addressInput.value = decodeURIComponent(
    currentFrame?.contentWindow?.location.href.split("/").pop()
  );

  document.dispatchEvent(
    new CustomEvent("switch-tab", {
      detail: { tabNumber },
    })
  );
}

/**
 * Closes the tab with the specified tab number.
 * @param {number} tabNumber - Tab number to close.
 */
export function closeTab(tabNumber) {
  const frames = document.querySelectorAll("iframe");
  [...frames].forEach((frame) => {
    if (frame.id === `frame-${tabNumber}`) {
      frame.remove();
    }
  });

  if (currentTab === tabNumber) {
    const otherFrames = document.querySelectorAll('iframe[id^="frame-"]');
    if (otherFrames.length > 0) {
      switchTab(parseInt(otherFrames[0].id.replace("frame-", "")));
    } else {
      newTab();
    }
  }

  document.dispatchEvent(
    new CustomEvent("close-tab", {
      detail: { tabNumber },
    })
  );
}

export function getOriginalUrl(url) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("/scramjet/") && url.includes(location.origin)) {
      try {
        const urlObj = new URL(url);
        if (urlObj.pathname.startsWith("/scramjet/")) {
          const encodedUrl = urlObj.pathname.substring("/scramjet/".length);
          try {
            const decoded = decodeURIComponent(encodedUrl);
            if (decoded.startsWith("http")) {
              return decoded;
            }
            const base64Decoded = atob(encodedUrl);
            if (base64Decoded.startsWith("http")) {
              return base64Decoded;
            }
          } catch (e) {}
        }
      } catch (e) {}
    } else {
      iframe.src.split(__uv$config.prefix)[1];
    }
    return url;
  }
}
