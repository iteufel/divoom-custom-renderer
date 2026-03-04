import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { getLocalIpForSubnet } from "./network";

const yamlConfigSchema = z.object({
  divoomPort: z.number().optional(),
  targetUrl: z.string().url().optional(),
  serveHost: z.string().optional(),
  servePort: z.number().optional(),
  viewportWidth: z.number().optional(),
  viewportHeight: z.number().optional(),
  showClock: z.boolean().optional(),
  showDate: z.boolean().optional(),
  showWeather: z.boolean().optional(),
  showTemperature: z.boolean().optional(),
});

export const configSchema = z.object({
  divoomPort: z.number(),
  targetUrl: z.string().url(),
  serveHost: z.string(),
  servePort: z.number(),
  viewportWidth: z.number(),
  viewportHeight: z.number(),
  showClock: z.boolean(),
  showDate: z.boolean(),
  showWeather: z.boolean(),
  showTemperature: z.boolean(),
});

export type Config = z.infer<typeof configSchema>;

const DEFAULTS: Config = {
  divoomPort: 9000,
  targetUrl: "https://example.com",
  serveHost: "192.168.1.10",
  servePort: 8765,
  viewportWidth: 800,
  viewportHeight: 1280,
  showClock: true,
  showDate: true,
  showWeather: false,
  showTemperature: false,
};

function loadYamlConfig(): z.infer<typeof yamlConfigSchema> {
  const configPath =
    process.env.DIVOOM_CONFIG ??
    join(process.cwd(), "divoom-renderer.yaml");
  const altPath = join(process.cwd(), "divoom-renderer.yml");

  const path = existsSync(configPath)
    ? configPath
    : existsSync(altPath)
      ? altPath
      : null;

  if (!path) return {};

  try {
    const text = readFileSync(path, "utf-8");
    const raw = Bun.YAML.parse(text);
    const result = yamlConfigSchema.safeParse(raw ?? {});
    if (!result.success) {
      console.error("❌ Invalid config in", path, result.error.flatten());
      return {};
    }
    return result.data;
  } catch {
    return {};
  }
}

function buildConfig(): Config {
  const yaml = loadYamlConfig();

  const config = {
    divoomPort: yaml.divoomPort ?? DEFAULTS.divoomPort,
    targetUrl: process.env.TARGET_URL ?? yaml.targetUrl ?? DEFAULTS.targetUrl,
    serveHost: process.env.SERVE_HOST ?? yaml.serveHost ?? DEFAULTS.serveHost,
    servePort: yaml.servePort ?? DEFAULTS.servePort,
    viewportWidth: yaml.viewportWidth ?? DEFAULTS.viewportWidth,
    viewportHeight: yaml.viewportHeight ?? DEFAULTS.viewportHeight,
    showClock: yaml.showClock ?? DEFAULTS.showClock,
    showDate: yaml.showDate ?? DEFAULTS.showDate,
    showWeather: yaml.showWeather ?? DEFAULTS.showWeather,
    showTemperature: yaml.showTemperature ?? DEFAULTS.showTemperature,
  };

  return configSchema.parse(config);
}

export const config = buildConfig();

/**
 * Resolves SERVE_HOST: uses env/yaml if set, otherwise auto-detects local IP
 * in the same subnet as the TimeFrame device.
 */
export function resolveServeHost(divoomIp: string): string {
  const explicit = process.env.SERVE_HOST ?? loadYamlConfig().serveHost;
  if (explicit) return explicit;
  const local = getLocalIpForSubnet(divoomIp);
  if (local) {
    console.log(`🌐 SERVE_HOST auto-detected from TimeFrame subnet: ${local}`);
    return local;
  }
  console.warn(
    `⚠️ Could not find local IP in same subnet as ${divoomIp}, using default ${DEFAULTS.serveHost}`,
  );
  return DEFAULTS.serveHost;
}
