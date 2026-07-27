# `@uvt/tcse` — Third-Party Content Stabilization Engine

The **Third-Party Content Stabilization Engine (TCSE)** is an architectural module within the Universal Visual Testing (UVT) platform designed to identify and stabilize volatile third-party UI elements (e.g., ad containers, cookie consent banners, live chat widgets, promotional popups, external iframes, and tracking pixels) prior to snapshot capture.

---

## 🏗️ Architecture Overview

TCSE is positioned directly between the **Dynamic Stabilization Engine (DSE)** and the **Decision Engine**:

```
Repository Intelligence
       ↓
Framework Intelligence
       ↓
Runtime DOM
       ↓
Dynamic Stabilization Engine (DSE)
       ↓
Third-Party Content Stabilization Engine (TCSE)
       ↓
Decision Engine
       ↓
Visual Stabilizer
       ↓
Snapshot Provider
```

---

## 📦 Key Concepts

### 1. Signal Models (`TCSESignal`)
Captured candidate element details:
- `category`: `'ad' | 'cookie_banner' | 'chat_widget' | 'popup_modal' | 'analytics_pixel' | 'third_party_iframe' | 'unknown'`
- `selector`: CSS selector targeting candidate element.
- `vendor`: Identified vendor source (e.g., `GoogleAdSense`, `OneTrust`, `Intercom`, `HubSpot`, `Drift`).
- `confidenceScore`: Score between `0.0` and `1.0`.

### 2. Confidence Scoring (`TCSEConfidenceModel`)
Evaluates signals against domain heuristics, selector patterns, and vendor indicators:
- `LOW`: Score < 0.4
- `MEDIUM`: 0.4 ≤ Score < 0.8
- `HIGH`: Score ≥ 0.8

### 3. Action Types & Decisions (`TCSEDecision`)
Action options:
- `HIDE`: Sets `display: none` / `visibility: hidden`.
- `REMOVE`: Removes element node from DOM.
- `MASK`: Overlays element with neutral visual mask.
- `FREEZE`: Pauses element timers/animations.
- `WAIT_FOR_LOAD`: Delays capture until element finishes rendering.
- `NO_ACTION`: Pass-through.

---

## 🎯 Official Plugins

### `AdDetectionPlugin` (Advertisement Detection Plugin)
Detects advertisements across web pages using 8 independent detection sources:
1. **Domain Intelligence**: Known ad network domain resolution (`doubleclick.net`, `googlesyndication.com`, `amazon-adsystem.com`, `adnxs.com`, `criteo.com`, `outbrain.com`, `taboola.com`).
2. **Iframe Analysis**: Attributes (`google_ads_iframe`, `data-ad-client`, `data-slot`) and iframe source inspection.
3. **CSS Heuristics**: Selector patterns (`.ad`, `.banner-ad`, `.sidebar-ad`, `#ad-slot`, `.google-ad`, `.sponsored-content`).
4. **ARIA Labels**: `aria-label`, `aria-roledescription`, or `role="region"` for ad keywords (`advertisement`, `sponsored`).
5. **Common Ad Dimensions**: Standard IAB ad banner dimensions (728x90, 300x250, 336x280, 160x600, 120x600, 300x600, 970x90, 970x250, 320x50, 320x100) within ±5px.
6. **Network Requests**: Intercepted page network request URLs matching ad domain registries.
7. **Mutation Observer**: Dynamic DOM node insertion into ad containers.
8. **Script Detection**: `<script>` tags loading ad libraries (`adsbygoogle.js`, `gpt.js`, `fbevents.js`, `amazon-ads.js`).

> [!NOTE]
> **Detection-Only Mode**: `AdDetectionPlugin` generates detailed `TCSESignal` records and evidence reasons, but does **NOT** hide elements, modify DOM nodes, or alter screenshot visuals.

---

## ⚡ Zero-Op Pass-Through Guarantee

When no TCSE plugins are registered or enabled (the default state):
- `TCSEEngine.process()` completes in `< 1ms` with `isZeroOp: true`.
- Zero DOM modifications or script injections are executed.
- Complete backward compatibility with existing UVT pipelines.

