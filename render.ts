#!/usr/bin/env bun
import { captureWebpage, makeScreenshotPath } from "./screenshot";
import { startFileServer } from "./server";
import { buildOverlays }   from "./overlays";
import { enterCustomMode, exitCustomMode } from "./divoom";
import { discoverDivoomIp } from "./discover";
import { config, resolveServeHost } from "./config";

// ── Optional: Weather WebP animation URL (10-frame webp per Divoom spec) ──────
const WEATHER_WEBP_URL =
  "https://f.divoom-gz.com/group1/M00/0C/4D/rBAAM2fZCOSEN4MoAAAAADuUrnI59.webp";

async function getDivoomIp(): Promise<string> {
  return process.env.DIVOOM_IP ?? discoverDivoomIp();
}

async function render(divoomIp: string) {
  const serveHost = resolveServeHost(divoomIp);

  // 1. Take screenshot of the target URL (unique filename per run)
  const screenshotPath = makeScreenshotPath();
  const serveFilename = screenshotPath.split("/").pop()!;
  await captureWebpage(config.targetUrl, screenshotPath);

  // 2. Start local HTTP server so device can fetch the screenshot (only TimeFrame allowed)
  const { url: imageUrl, stop } = startFileServer(screenshotPath, serveFilename, serveHost, divoomIp);

  try {
    // 3. Build overlay elements (clock, date, weather, etc.)
    const dispList = buildOverlays(WEATHER_WEBP_URL);

    // 4. Send to Times Frame
    await enterCustomMode(divoomIp, imageUrl, dispList);

    // 5. Keep server alive so the device can re-fetch the image
    //    Times Frame fetches the background once on mode entry,
    //    so we can shut down after a short grace period.
    console.log("⏳ Keeping server alive for 10s for device fetch...");
    await Bun.sleep(10_000);
  } finally {
    stop();
    console.log("🔌 File server stopped.");
  }
}

// ── Optional: continuous auto-refresh loop ─────────────────────────────────
async function loop(divoomIp: string, intervalMs = 60_000) {
  console.log(`🔄 Auto-refresh every ${intervalMs / 1000}s. Press Ctrl+C to exit.`);

  process.on("SIGINT", async () => {
    console.log("\n🛑 Exiting custom mode on SIGINT...");
    await exitCustomMode(divoomIp);
    process.exit(0);
  });

  while (true) {
    try {
      await render(divoomIp);
    } catch (err) {
      console.error("❌ Render error:", err);
    }
    console.log(`⏸  Next refresh in ${intervalMs / 1000}s...`);
    await Bun.sleep(intervalMs);
  }
}

// ── Entrypoint ────────────────────────────────────────────────────────────
const REFRESH_INTERVAL = Number(process.env.INTERVAL_MS ?? 10_000);
const AUTO_LOOP        = process.env.LOOP !== "0";

const divoomIp = await getDivoomIp();

if (AUTO_LOOP) {
  loop(divoomIp, REFRESH_INTERVAL);
} else {
  render(divoomIp).catch((err) => {
    console.error("❌ Fatal:", err);
    process.exit(1);
  });
}

