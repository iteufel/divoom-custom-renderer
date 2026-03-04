# Divoom TimeFrame API

API-Dokumentation für die Divoom TimeFrame: Gerätesuche, Custom Display Mode und verwandte Befehle.

**Geräte-API (lokal):** `http://IP:9000/divoom_api` · **Cloud-API:** `https://app.divoom-gz.com` · **Methode:** `GET`

---

## Inhaltsverzeichnis

1. [Find Device (ReturnSameLANDevice)](#find-device-returnsamelandevice)
2. [Enter Custom Display Mode](#enter-custom-display-mode)
3. [Exit Custom Display Mode](#exit-custom-display-mode)
4. [Display-Element-Typen](#display-element-typen)
5. [DispList Parameter-Referenz](#displist-parameter-referenz)

---

## Find Device (ReturnSameLANDevice)

Ermittelt Divoom-Geräte im gleichen lokalen Netzwerk (LAN).

**Basis-URL:** [https://app.divoom-gz.com/Device/ReturnSameLANDevice](https://app.divoom-gz.com/Device/ReturnSameLANDevice)

### Response-Beispiel

```json
{
  "ReturnCode": 0,
  "ReturnMessage": ""
}
```

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `ReturnCode` | number | `0` = Erfolg |
| `ReturnMessage` | string | Optionale Statusmeldung |

---

## Enter Custom Display Mode

Eintritt in den Custom Display Mode. Das Gerät akzeptiert anschließend benutzerdefinierte Befehle für die Anzeige.

### Request

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `Command` | string | **Erforderlich.** `Device/EnterCustomControlMode` |
| `BackgroudImageAddr` | string | Hintergrundbild. Muss 800×1280 Pixel haben. Entweder URL oder lokaler Pfad (`/userdata/clock_bg.jpg`) |
| `BackgroudImageLocalFlag` | number | `1`: `BackgroudImageAddr` ist ein lokales File (`/userdata/clock_bg.jpg`); `0`: URL |
| `DispList` | Array | Liste der Anzeige-Elemente |

### DispList – unterstützte Elemente

| Typ | Beschreibung | Max. Anzahl |
|-----|--------------|-------------|
| `Text` | Benutzerdefinierter Text | 6 |
| `Image` | Bild-Element | 10 |
| `NetData` | Netzwerk-Anfragen | 6 |
| `Time` | Uhrzeit |
| `Date` | Datum |
| `Weather` | Wetter (WebP-Animation, 10 Frames in definierter Reihenfolge) |
| `Temperature` | Temperatur |
| `MonYear` | Monat-Jahr (z.B. 2025-08) |
| `Mday` | Tag im Monat |
| `Year` | Jahr |
| `Month` | Monat |
| `Week` | Wochentag |

**Hinweis zu Weather:** Muss eine WebP-Animation mit 10 Bildern enthalten (Reihenfolge: sonnig Tag, bewölkt Tag, regnerisch, Schnee, Nebel, sonnig Nacht, bewölkt Nacht, regnerisch Nacht, Schnee Nacht, Nebel Nacht).

**NetData-Dokumentation:** [https://docin.divoom-gz.com/web/#/5/145](https://docin.divoom-gz.com/web/#/5/145)

### Beispiel – Netzwerk-Datei (URL)

```json
{
  "Command": "Device/EnterCustomControlMode",
  "BackgroudImageLocalFlag": 0,
  "BackgroudImageAddr": "https://f.divoom-gz.com/group1/M00/0C/53/rBAAM2faipuEYhJQAAAAAAsMG7w762.jpg",
  "DispList": [
    {
      "ID": 1,
      "Type": "NetData",
      "StartX": 491,
      "StartY": 462,
      "Width": 272,
      "Height": 53,
      "Align": 0,
      "FontSize": 40,
      "FontID": 52,
      "FontColor": "#FFFFFF",
      "BgColor": "#FF0000",
      "Url": "https://app.divoom-gz.com/User/GetUserData?SearchDivoomUser=400000012",
      "RuleInfo": "n:Score",
      "RequestTime": 30
    },
    {
      "ID": 4,
      "Type": "Time",
      "StartX": 474,
      "StartY": 1123,
      "Width": 308,
      "Height": 125,
      "Align": 1,
      "FontSize": 95,
      "FontID": 52,
      "FontColor": "#A8B35E",
      "BgColor": "#FF0000"
    },
    {
      "ID": 10,
      "Type": "Weather",
      "StartX": 33,
      "StartY": 1135,
      "Width": 64,
      "Height": 64,
      "Align": 2,
      "Url": "https://f.divoom-gz.com/group1/M00/0C/4D/rBAAM2fZCOSEN4MoAAAAADuUrnI59.webp"
    },
    {
      "ID": 13,
      "Type": "Text",
      "StartX": 0,
      "StartY": 10,
      "Width": 720,
      "Height": 90,
      "Align": 2,
      "FontSize": 64,
      "FontID": 126,
      "FontColor": "#484D12",
      "BgColor": "#FF0000",
      "TextMessage": "this is text"
    }
  ]
}
```

### Beispiel – lokale Datei

```json
{
  "Command": "Device/EnterCustomControlMode",
  "BackgroudImageLocalFlag": 1,
  "BackgroudImageAddr": "/userdata/clock_bg.jpg",
  "DispList": [
    {
      "ID": 12,
      "Type": "Image",
      "StartX": 13,
      "StartY": 227,
      "Width": 320,
      "Height": 320,
      "Align": 2,
      "ImgLocalFlag": 1,
      "Url": "/userdata/weather.gif"
    },
    {
      "ID": 13,
      "Type": "Text",
      "StartX": 0,
      "StartY": 10,
      "Width": 720,
      "Height": 90,
      "Align": 2,
      "FontSize": 64,
      "FontID": 126,
      "FontColor": "#484D12",
      "BgColor": "#FF0000",
      "TextMessage": "this is text"
    }
  ]
}
```

### Response

```json
{
  "ReturnCode": 0
}
```

---

## Exit Custom Display Mode

Beendet den Custom Display Mode.

### Request

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `Command` | string | **Erforderlich.** `Device/ExitCustomControlMode` |

### Beispiel-Request

```
GET http://IP:9000/divoom_api?Command=Device/ExitCustomControlMode
```

### Response

```json
{
  "ReturnCode": 0
}
```

---

## Display-Element-Typen

| Type | Beschreibung |
|------|--------------|
| `Text` | Statischer oder dynamischer Text |
| `Image` | Bild oder GIF |
| `NetData` | Daten von HTTP-Endpunkt (mit RuleInfo geparst) |
| `Time` | Uhrzeit |
| `Date` | Datum |
| `Weather` | Wetter-Animation (WebP mit 10 Frames) |
| `Temperature` | Temperatur |
| `MonYear` | Format: `YYYY-MM` |
| `Mday` | Tag im Monat |
| `Year` | Jahr |
| `Month` | Monat |
| `Week` | Wochentag |

---

## DispList Parameter-Referenz

| Parameter | Typ | Gültig für | Beschreibung |
|-----------|-----|------------|--------------|
| `ID` | number | alle | Eindeutige ID. Bereits vorhandene IDs werden überschrieben. Muss > 0 sein |
| `Type` | string | alle | Elementtyp (siehe oben) |
| `StartX` | number | alle | X-Koordinate des Anzeigebereichs |
| `StartY` | number | alle | Y-Koordinate des Anzeigebereichs |
| `Width` | number | alle | Breite des Anzeigebereichs |
| `Height` | number | alle | Höhe des Anzeigebereichs |
| `Align` | number | alle | `0` = links, `1` = rechts, `2` = mittig |
| `FontSize` | number | Text, NetData, etc. | Schriftgröße |
| `FontID` | number | Text, NetData, etc. | Font-ID |
| `FontColor` | string | Text, NetData, etc. | Farbe z.B. `#FFFFFF` |
| `BgColor` | string | alle | Hintergrundfarbe z.B. `#000000` |
| `Url` | string | NetData, Image, Weather | URL oder lokaler Pfad |
| `RuleInfo` | string | NetData | Parsing-Regel für Netzwerk-Response |
| `TextMessage` | string | Text | Anzuzeigender Text |
| `RequestTime` | number | NetData | Intervall für Netzwerk-Anfragen (Sekunden, mind. 10) |
| `ImgLocalFlag` | number | Image | `1` = lokale Datei, `0` = URL |

---

## Bildauflösung

- **Hintergrundbild:** 800 × 1280 Pixel (Pflicht)

---

## Verwandte APIs

Weitere Divoom-Befehle:

- [ReturnSameLANDevice](https://app.divoom-gz.com/Device/ReturnSameLANDevice) – Geräte im gleichen LAN finden
- **Update Text Content** – Text in bestehenden Elementen aktualisieren
- **Get font list** – Liste verfügbarer Schriften abrufen

---

*Dokumentation basierend auf der Divoom API. Bei Fragen: [Contact Divoom](https://www.divoom.com)*
