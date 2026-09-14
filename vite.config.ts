import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

function servePreviewHtml(): Plugin {
  const attach = (server: {
    middlewares: {
      use: (
        fn: (
          req: { url?: string },
          res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void },
          next: () => void,
        ) => void,
      ) => void;
    };
  }) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split("?")[0] ?? "";
      if (url !== "/preview.html") {
        next();
        return;
      }
      try {
        const html = readFileSync(resolve(process.cwd(), "preview.html"), "utf8");
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(html);
      } catch {
        next();
      }
    });
  };

  return {
    name: "serve-preview-html",
    configureServer(server) {
      attach(server as never);
    },
    configurePreviewServer(server) {
      attach(server as never);
    },
  };
}

export default defineConfig({
  // Stop Lovable's default Cloudflare Nitro target; Vercel gets its own preset.
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [servePreviewHtml()],
  vite: {
    base: "/",
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
    server: {
      allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1", ".vercel.app"],
    },
    preview: {
      allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1", ".vercel.app"],
    },
  },
});
