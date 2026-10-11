# Architectural Ledger & Context Freeze: Fann À Porter AR Companion

**Document Identifier:** `_fann_ar_state_oct2026.md`  
**Creation Timestamp:** October 7, 2026 — 20:15:00 UTC+3  
**Last Updated Timestamp:** October 11, 2026 — 17:20:00 UTC+3 (10/11/2026)  
**Role Context:** Lead AI IDE Ledger for Chief Architect (Mohammad Shanti)  
**Project:** Fann À Porter AR Companion (`moeshanti/the-workshop-ar`)  
**Deployment Target:** Netlify (automated via `origin/main`)  
**Production QR Endpoint:** `https://majd-moon-skies.fannaporter.com/` (CNAME to Netlify)  
**Exhibition Opening:** October 17, 2026  
**Current Operational Status:** **STANDBY / FROZEN (Zero Tolerance Protocol — Zero Blast Radius)**  

---

## 1. System Baseline & Git Ledger

| Commit Hash | Commit Message | Scope / Key Changes |
|---|---|---|
| `5447b02` | `ZTP: Update AR narrative videos and ambient audio; increment PWA cache to v1.23` | Replaced 4 media files (`music_butterflies.mp3`, `music_twoskies.mp3`, `story.mp4`, `story2.mp4`); cache bumped to `v1.23`. |
| `9ea6311` | `feat: UX timing polish, WhatsApp OG refactor, social tags, cache v1.24` | Drawer delay increased to 12.5s (retaining 2.5s peek); WhatsApp message refactored to use `${data.catalogUrl}`; `@fannaporter` share tags; clipboard toast to "CAPTION COPIED!"; cache bumped to `v1.24`. |
| `a0ca087` | `feat: finalize client data polish (bilingual quotes, master url routing, cache v1.25)` | Injected `quoteAr` / `quoteEn` with directional `.innerHTML` rendering; pricing zeroed out; catalog URL routed to `/works/`; cache bumped to `v1.25`. |
| `564d5fc` | `feat: Darwish title polish, restore red 'فن' PWA icon, harden QR cache headers, cache v1.26` | Injected Darwish quotes on Two Skies; normalized `manifest.json` discrete sizes & `<link rel="icon">`; hardened `_headers` for QR code root `/` and `/sw.js`; bumped cache to `v1.26`. |

* **Active Remote:** `origin/main` (`https://github.com/moeshanti/the-workshop-ar.git`)
* **Working Tree:** Phase 3 adjustments applied. Clean diff against protected core.
* **Active Service Worker Cache Key:** `fann-ar-v1.26`


---

## 2. Executed Phase 2 Specifications (Active in Production)

### 2.1. Pop-Up Drawer Delay Calibration
* **Location:** [`index.html#L722`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/index.html#L722)
* **Implementation:**
  ```javascript
  window.cardTimer = setTimeout(() => {
      openCard();
      window.closeTimer = setTimeout(() => {
          closeCard();
          window.closeTimer = null;
      }, 2500);
      window.cardTimer = null;
  }, 12500); // 12.5 seconds initial delay (25% increase)
  ```
* **Architectural Rationale:** Initial timer increased by 25% (from 10s to 12.5s) to allow gallery visitors uninterrupted immersion during the primary 3D AR animation and spatial audio loop. The 2.5s auto-close peek mechanic (`window.closeTimer`) is strictly preserved.

### 2.2. Data Model Decoupling & Firebase Protection
* **Location:** [`index.html#L413-L440`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/index.html#L413-L440)
* **Architectural Rationale:**
  - Canonical `title` strings (`"The Butterfly Voyage"` and `"Two Skies"`) remain 100% intact to prevent schema corruption and key collisions in Firebase Firestore ratings (`window.submitRating`).
  - Added dedicated presentation fields `quoteAr` and `quoteEn`.
  - Set `price: ""` across all objects as requested by client.
  - Routed `catalogUrl` directly to the `/works/` exhibition tab for both artworks.

### 2.3. Directional Bilingual Title Rendering
* **Location:** [`index.html#L752`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/index.html#L752) inside `updateUI(index)`
* **Implementation:**
  ```javascript
  document.getElementById('lbl-title').innerHTML = `<div dir="rtl" class="mb-1 leading-relaxed">${data.quoteAr}</div><div dir="ltr" class="text-sm opacity-80 italic">${data.quoteEn}</div>`;
  document.getElementById('lbl-artist').innerText = data.artist || "Fann À Porter";
  ```
* **Architectural Rationale:** Uses explicit `dir="rtl"` and `dir="ltr"` wrappers inside `.innerHTML` to eliminate iOS WebKit Unicode Bidirectional Algorithm (UBA) punctuation flipping. `#lbl-artist` remains strictly untouched.

---

## 3. Pre-Exhibition Phase 3 Specifications (October 11, 2026 Audit)

### 3.1. Artwork 1 ("Two Skies") Darwish Title Alignment
* **Technical Context:** Gallery catalog on `.../works/` officially titles the painting:  
  `"من سماء إلى أختها يعبر الحالمون" - محمود درويش` / `"From one sky to its sister, the dreamers travel" - Mahmoud Darwish, 2025`
* **Implementation:**
  ```javascript
  // window.ARTWORK_DATA[1]
  quoteAr: "\"من سماء إلى أختها يعبر الحالمون\" <span class=\"text-sm font-normal opacity-75\">- محمود درويش</span>",
  quoteEn: "\"From one sky to its sister, the dreamers travel\" <span class=\"text-xs font-normal opacity-75 not-italic\">- Mahmoud Darwish</span>",
  ```
* **Architectural Rationale:** Quotes and poet attribution are added directly to the presentation strings with subtle, non-intrusive opacity. This satisfies the client's curatorial request without altering DOM structure or overflowing the 500px drawer.

### 3.2. Preservation of Independent Social Share Captions
* **Technical Context:** Confirmed via primary WhatsApp evidence that the two artworks are completely separate paintings with dedicated visual themes and independent captions:
  - **Artwork 1 ("Two Skies" - Cloud/Sky Art):** Retains cloud emoji and dedicated tags:  
    `shareCaption: "Witness 'Two Skies' by Majd Kurdieh come to life! ✨☁️ @fannaporter #MajdKurdieh #TwoSkies"`
  - **Artwork 0 ("The Butterfly Voyage" - Butterfly Art):** Retains butterfly emoji and campaign tags:  
    `shareCaption: "Witness the magic of Majd Kurdieh come to life! ✨🦋 @fannaporter #ARArt"`
* **Architectural Rationale:** No caption unification or butterfly emoji contamination across distinct artworks.

### 3.3. PWA WebKit Manifest & Red "فن" Calligraphy Icon Restoration
* **Technical Context:** Asset `assets/apple-icon-red.png` is an opaque red square with white Arabic calligraphy **"فن"**. Recent iOS 17.4+ and iOS 18 WebKit changes reject space-delimited `"sizes": "180x180 192x192 512x512"` in `manifest.json`, defaulting to a generic grey Latin letter "F" monogram.
* **Implementation:**
  1. Decompose `manifest.json` icons into discrete size objects (`180x180`, `192x192`, `512x512`).
  2. Add `<link rel="icon" type="image/png" href="./assets/apple-icon-red.png">` and `<link rel="apple-touch-icon" sizes="180x180" href="./assets/apple-icon-red.png">` in `index.html`.
* **Architectural Rationale:** Restores the authentic red "فن" logo across all iOS and Android home screens, bookmarks, and browser tabs.

### 3.4. Physical QR Code Cache-Busting via Netlify Headers
* **Technical Context:** Exhibition visitors scan a physical QR code that opens `https://the-workshop-ar.netlify.app/`. In Netlify edge routing, `/` does not match `/index.html`, and `sw.js` was uncached.
* **Implementation in `_headers`:**
  ```ini
  /sw.js
    Cache-Control: no-cache, no-store, must-revalidate

  /manifest.json
    Cache-Control: no-cache, no-store, must-revalidate

  /index.html
    Cache-Control: no-cache, no-store, must-revalidate

  /
    Cache-Control: no-cache, no-store, must-revalidate
  ```
* **Implementation in `index.html`:** Add `reg.update()` immediately after service worker registration.
* **Implementation in `sw.js`:** Increment cache key to `fann-ar-v1.26`.
* **Architectural Rationale:** Guarantees 100% cache invalidation so every single visitor scanning the QR code receives the latest build without exception.

---

## 4. Protected Core Architecture (Strictly Frozen — Zero Blast Radius)

Under the Zero Tolerance Protocol, the following core systems remain **100% unmodified**:
1. **Feature Tracking Matrix:** [`assets/targets.mind`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/targets.mind) (tracking stability verified).
2. **WebGL Shaders & Video Textures:** Three.js custom chroma-key fragment shaders and [`assets/Butterfly.mp4`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/Butterfly.mp4).
3. **3D Models:** [`The_Star.glb`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/The_Star.glb), [`Two_Sky.glb`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/Two_Sky.glb), and [`moon.glb`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/moon.glb).
4. **Narrative & Ambient Media:** [`music_butterflies.mp3`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/music_butterflies.mp3), [`music_twoskies.mp3`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/music_twoskies.mp3), [`story.mp4`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/story.mp4), and [`story2.mp4`](file:///Users/mohammadelshanti/AntigravityProjects/the-workshop-ar/assets/story2.mp4).
5. **Firebase Collection:** Rating submission keys and deduplication sets (`ratedArtworks`).

---

## 5. Instructions for Context Resumption

When re-opening this project in a future session:
1. Ingest this file (`_fann_ar_state_oct2026.md`) as the primary ground truth.
2. Verify git status is clean (`git status`).
3. Check `sw.js` to confirm `CACHE_NAME` is at minimum `'fann-ar-v1.26'`.
4. Ensure no modifications touch the protected core assets listed in Section 4.
