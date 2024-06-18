// import worker as asset
import worker_asset from "../worker.js" with { type: "file" };
// import a worker dependency as asset
import libwebview from "./libwebview.so" with { type: "file" };

// start server
Bun.serve({ port: 6161, fetch: () => new Response("hi") });

// start worker
const worker = new Worker(URL.createObjectURL(Bun.file(worker_asset)));
// pass in dependency URL
worker.postMessage({ dependencies: { libwebview } });
