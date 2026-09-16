// Used as a wrapper for the bare-mux worker
// The browser worker is published by BareMux's browser distribution; the
// server package mounted at /baremux/ does not include this worker file.
importScripts("https://unpkg.com/@mercuryworkshop/bare-mux@2.1.7/dist/worker.js");
