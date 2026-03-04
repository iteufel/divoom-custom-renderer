/**
 * Discover Divoom TimeFrame IP via ReturnSameLANDevice cloud API when DIVOOM_IP is not set.
 */

const CLOUD_API = "https://app.divoom-gz.com/Device/ReturnSameLANDevice";

export async function discoverDivoomIp(): Promise<string> {
  const res = await fetch(CLOUD_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Command: "Device/ReturnSameLANDevice" }),
  });

  const json = (await res.json()) as {
    ReturnCode?: number;
    DeviceList?: Array<{ DevicePrivateIP?: string }>;
  };

  const list = json?.DeviceList;
  if (Array.isArray(list) && list.length > 0) {
    const ip = list[0]?.DevicePrivateIP;
    if (typeof ip === "string" && ip) {
      console.log(`📍 Device found: ${ip}`);
      return ip;
    }
  }

  throw new Error(
    "No Divoom device found via API. Set DIVOOM_IP manually.",
  );
}
