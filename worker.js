// only built-in imports allowed
import { FFIType, dlopen, ptr } from "bun:ffi";

const cstring = value => ptr(new TextEncoder().encode(`${value}\0`));

// load binary dependency
const import_binary_dependency = bin => dlopen(bin, {
  webview_create: {
      args: [FFIType.i32, FFIType.ptr],
      returns: FFIType.ptr,
  },
  webview_destroy: {
      args: [FFIType.ptr],
      returns: FFIType.void,
  },
  webview_run: {
      args: [FFIType.ptr],
      returns: FFIType.void,
  },
  webview_terminate: {
      args: [FFIType.ptr],
      returns: FFIType.void,
  },
  webview_navigate: {
      args: [FFIType.ptr, FFIType.ptr],
      returns: FFIType.void,
  },
});

const wv = bin => {
  const lib = import_binary_dependency(bin);

  const Webview = class Webview {
    #handle = null;
    constructor() {
      this.#handle = lib.symbols.webview_create(true, null);
    }

    destroy() {
      lib.symbols.webview_terminate(this.#handle);
      lib.symbols.webview_destroy(this.#handle);
      this.#handle = null;
    }

    navigate(url) {
      lib.symbols.webview_navigate(this.#handle, cstring(url));
    }

    run() {
      lib.symbols.webview_run(this.#handle);
      this.destroy();
    }
  };

  return Webview;
};

self.addEventListener("message", event => {
  const { dependencies: { libwebview } } = event.data;
  const Webview = wv(Bun.file(libwebview));
  const webview = new Webview();
  webview.navigate("http://localhost:6161");
  webview.run();
});
