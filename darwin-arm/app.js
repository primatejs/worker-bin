import Webview from "@rcompat/webview/worker/darwin-arm64";

// start server
Bun.serve({ port: 6161, fetch: () => new Response("hi") });

const webview = new Webview();
webview.navigate("http://localhost:6161/svelte");
webview.run();
