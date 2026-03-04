import { serve } from "bun";
import { readFile } from "node:fs/promises";
import { config } from "./config";

/** Starts a temporary HTTP server so the Divoom device can fetch the screenshot. */
export function startFileServer(
  filePath: string,
  serveFilename: string,
  host?: string,
  allowedIp?: string,
): { url: string; stop: () => void } {
  const serveHost = host ?? config.serveHost;
  const imageUrl = `http://${serveHost}:${config.servePort}/${serveFilename}`;

  const server = serve({
    port: config.servePort,
    async fetch(req, srv) {
      if (allowedIp) {
        const client = srv.requestIP(req);
        const clientIp = client?.address ?? "";
        // Handle IPv4-mapped IPv6 (e.g. ::ffff:192.168.0.8 -> 192.168.0.8)
        const normalized = clientIp.replace(/^::ffff:/i, "");
        if (normalized !== allowedIp) {
          console.warn(`🚫 Blocked request from ${clientIp} (only ${allowedIp} allowed)`);
          return new Response("Forbidden", { status: 403 });
        }
      }
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

  console.log(`🌐 File server running at ${imageUrl} (access restricted to TimeFrame ${allowedIp ?? "any"})`);
  return {
    url: imageUrl,
    stop: () => server.stop(),
  };
}

