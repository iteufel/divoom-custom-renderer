import { config } from "./config";

export interface DispItem {
  ID:            number;
  Type:          string;
  StartX:        number;
  StartY:        number;
  Width:         number;
  Height:        number;
  Align:         0 | 1 | 2;       // 0=left, 1=right, 2=center
  FontSize:      number;
  FontID:        number;
  FontColor:     string;
  BgColor:       string;
  TextMessage?:  string;
  Url?:          string;
  RuleInfo?:     string;
  RequestTime?:  number;
  ImgLocalFlag?: number;
  TimeFormat?:   number;   // 24 = 24h clock (for Time element)
}

/**
 * Build the DispList overlay array.
 * All positions are in the 800×1280 coordinate space.
 * BgColor "#00000000" is fully transparent (device ignores it if alpha=0).
 * Use "#FF000000" for a transparent background workaround if needed.
 */
export function buildOverlays(weatherWebpUrl?: string): DispItem[] {
  const items: DispItem[] = [];
  let id = 1;

  const transparent = "#00000000";
  const white       = "#FFFFFF";
  const accent      = "#A8E6CF";

  // ── Clock (bottom-right) ─────────────────────────────────────────────────
  if (config.showClock) {
    items.push({
      ID: id++, Type: "Time",
      StartX: 480, StartY: 1200,
      Width: 300,  Height: 70,
      Align: 1, FontSize: 60, FontID: 52,
      FontColor: white, BgColor: transparent,
      TimeFormat: 24,
    });
  }

  // ── Date: day of month (bottom-left) ─────────────────────────────────────
  if (config.showDate) {
    items.push({
      ID: id++, Type: "Mday",
      StartX: 20, StartY: 1200,
      Width: 60,  Height: 45,
      Align: 0, FontSize: 36, FontID: 52,
      FontColor: accent, BgColor: transparent,
    });

    // Month + Year
    items.push({
      ID: id++, Type: "MonYear",
      StartX: 20, StartY: 1245,
      Width: 200, Height: 35,
      Align: 0, FontSize: 28, FontID: 52,
      FontColor: accent, BgColor: transparent,
    });

    // Weekday
    items.push({
      ID: id++, Type: "Week",
      StartX: 90, StartY: 1200,
      Width: 120, Height: 45,
      Align: 0, FontSize: 36, FontID: 52,
      FontColor: white, BgColor: transparent,
    });
  }

  // ── Weather animation (bottom-left corner icon) ───────────────────────────
  if (config.showWeather && weatherWebpUrl) {
    items.push({
      ID: id++, Type: "Weather",
      StartX: 20, StartY: 1130,
      Width: 64,  Height: 64,
      Align: 2, FontSize: 0, FontID: 0,
      FontColor: white, BgColor: transparent,
      Url: weatherWebpUrl,
    });
  }

  // ── Temperature ──────────────────────────────────────────────────────────
  if (config.showTemperature) {
    items.push({
      ID: id++, Type: "Temperature",
      StartX: 90, StartY: 1140,
      Width: 100, Height: 40,
      Align: 0, FontSize: 30, FontID: 52,
      FontColor: accent, BgColor: transparent,
    });
  }

  return items;
}

