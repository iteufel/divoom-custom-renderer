import { networkInterfaces } from "node:os";

/**
 * Returns this machine's IPv4 address that is in the same /24 subnet as the given peer IP.
 * Used to auto-detect SERVE_HOST when the TimeFrame device is on the same LAN.
 */
export function getLocalIpForSubnet(peerIp: string): string | null {
  const parts = peerIp.trim().split(".");
  if (parts.length !== 4) return null;

  const a = Number(parts[0]);
  const b = Number(parts[1]);
  const c = Number(parts[2]);
  if (
    Number.isNaN(a) ||
    Number.isNaN(b) ||
    Number.isNaN(c) ||
    a < 0 ||
    a > 255 ||
    b < 0 ||
    b > 255 ||
    c < 0 ||
    c > 255
  ) {
    return null;
  }

  const subnetPrefix = `${a}.${b}.${c}.`;

  for (const addrs of Object.values(networkInterfaces())) {
    if (!Array.isArray(addrs)) continue;
    for (const iface of addrs as Array<{ family: string | number; internal: boolean; address: string }>) {
      const family = typeof iface.family === "string" ? iface.family : "IPv" + iface.family;
      if (family === "IPv4" && !iface.internal && iface.address.startsWith(subnetPrefix)) {
        return iface.address;
      }
    }
  }
  return null;
}
