export const config = {
  divoomPort: 9000,
  targetUrl:  process.env.TARGET_URL  ?? "https://example.com",

  // The Times Frame fetches this URL for the background image (800×1280)
  // Must be reachable from the device on your LAN
  serveHost:  process.env.SERVE_HOST  ?? "192.168.1.10", // your machine's LAN IP
  servePort:  8765,

  // Screenshot viewport — must match the display ratio (800×1280)
  viewportWidth:  800,
  viewportHeight: 1280,

  // Overlay config (set false to show a clean screenshot only)
  showClock:       true,
  showDate:        true,
  showWeather:     false,
  showTemperature: false,
} as const;

