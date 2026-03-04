import { config } from "./config";
import type { DispItem } from "./overlays";

async function apiCall(
  divoomIp: string,
  body: Record<string, unknown>,
): Promise<{ ReturnCode: number }> {
  const base = `http://${divoomIp}:${config.divoomPort}/divoom_api`;
  let res: Response;
  try {
    res = await fetch(base, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Cannot reach TimeFrame at ${base}: ${msg}\n` +
        `  → Check device is on and awake\n` +
        `  → Try DIVOOM_PORT=5200 if 9000 fails (some models use 5200)\n` +
        `  → Verify device is on same network as this machine`,
    );
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from device`);
  }

  const json = await res.json() as { ReturnCode: number };
  if (json.ReturnCode !== 0) {
    throw new Error(`Device error: ReturnCode=${json.ReturnCode}`);
  }

  return json;
}

/** Enter custom display mode with a background image URL and overlay elements. */
export async function enterCustomMode(
  divoomIp: string,
  backgroundImageUrl: string,
  dispList: DispItem[],
): Promise<void> {
  console.log("🖼️  Entering custom display mode...");

  await apiCall(divoomIp, {
    Command:                 "Device/EnterCustomControlMode",
    BackgroudImageLocalFlag: 0,              // 0 = URL, not local file
    BackgroudImageAddr:      backgroundImageUrl,
    DispList:                dispList,
  });

  console.log("✅ Custom mode active.");
}

/** Exit custom display mode and return to previous channel. */
export async function exitCustomMode(divoomIp: string): Promise<void> {
  console.log("🚪 Exiting custom display mode...");
  await apiCall(divoomIp, { Command: "Device/ExitCustomControlMode" });
  console.log("✅ Exited.");
}

