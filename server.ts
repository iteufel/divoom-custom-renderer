import { serve } from "bun";
import { readFile } from "node:fs/promises";
import { config } from "./config";

/** Starts a temporary HTTP server so the Divoom device can fetch the screenshot. */
export function startFileServer(filePath: string, serveFilename: string): { url: string; stop: () => void } {
  const imageUrl = `http://${config.serveHost}:${config.servePort}/${serveFilename}`;

  const server = serve({
    port: config.servePort,
    async fetch(req) {
      const path = new URL(req.url).pathname;
      if (path === `/${serveFilename}`) {
        const file = await readFile(filePath);
        return new Response(file, {
          headers: { "Content-Type": "image/jpeg" },
        });
      }
      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(`🌐 File server running at ${imageUrl}`);
  return {
    url: imageUrl,
    stop: () => server.stop(),
  };
}

