# divoom-custom-renderer

Renders any webpage to a **Divoom TimeFrame** digital picture frame. Takes a screenshot (800×1280), serves it on your LAN, and pushes it to the device with optional overlays (24h clock, date, weather, temperature).

## Setup

```bash
bun install
```

## Run

Minimal run (device and `SERVE_HOST` are auto-discovered):

```bash
TARGET_URL=https://example.com bun run render.ts
```

Optional overrides:

```bash
DIVOOM_IP=192.168.0.8 SERVE_HOST=192.168.0.123 TARGET_URL=https://example.com bun run render.ts
```

- **`DIVOOM_IP`** — device is auto-discovered via the Divoom cloud API when unset. Set manually if discovery fails.
- **`SERVE_HOST`** — auto-detected from the TimeFrame subnet when unset (your machine's LAN IP on the same network as the device).

Auto-refresh runs every **10 seconds** by default. Press `Ctrl+C` to exit and leave custom mode cleanly.

The file server only accepts requests from the TimeFrame device; all other clients receive `403 Forbidden`.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DIVOOM_IP` | TimeFrame IP on your LAN (optional – auto-discovered via Divoom API if unset) | — |
| `SERVE_HOST` | Your machine’s LAN IP (device fetches screenshot from here). Auto-detected from TimeFrame subnet when unset. | `192.168.1.10` |
| `TARGET_URL` | URL to capture as background | `https://example.com` |
| `INTERVAL_MS` | Refresh interval (ms) | `10000` (10s) |
| `LOOP` | Set to `0` to run once (no loop) | auto-refresh enabled |

## Config

**YAML config:** Create `divoom-renderer.yaml` in the project directory (or set `DIVOOM_CONFIG` to a path). Copy `divoom-renderer.example.yaml` and edit:

```yaml
targetUrl: https://example.com
# serveHost: 192.168.1.10   # optional – auto-detected from TimeFrame subnet
servePort: 8765
showClock: true
showDate: true
showWeather: false
showTemperature: false
```

Env vars override YAML. You can also edit `config.ts` for defaults.
