# divoom-custom-renderer

Renders any webpage to a **Divoom TimeFrame** digital picture frame. Takes a screenshot (800×1280), serves it on your LAN, and pushes it to the device with optional overlays (24h clock, date, weather, temperature).

## Setup

```bash
bun install
```

## Run

```bash
SERVE_HOST=192.168.0.123 TARGET_URL=https://example.com bun run render.ts
```

`DIVOOM_IP` is optional — the device is auto-discovered via the Divoom cloud API when unset. Set it manually if discovery fails:

```bash
DIVOOM_IP=192.168.0.8 SERVE_HOST=192.168.0.123 TARGET_URL=https://example.com bun run render.ts
```

Auto-refresh runs every **10 seconds** by default. Press `Ctrl+C` to exit and leave custom mode cleanly.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DIVOOM_IP` | TimeFrame IP on your LAN (optional – auto-discovered via Divoom API if unset) | — |
| `SERVE_HOST` | Your machine’s LAN IP (device fetches screenshot from here) | `192.168.1.10` |
| `TARGET_URL` | URL to capture as background | `https://example.com` |
| `INTERVAL_MS` | Refresh interval (ms) | `10000` (10s) |
| `LOOP` | Set to `0` to run once (no loop) | auto-refresh enabled |

## Config

Edit `config.ts` to toggle overlays: `showClock`, `showDate`, `showWeather`, `showTemperature`.
