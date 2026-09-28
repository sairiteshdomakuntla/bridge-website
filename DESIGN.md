# Bridge — Design System (website sets the brand)

Source of truth for the Bridge brand. Built for the marketing site first;
the Android + Windows app theme should be moved to match it later.
All values exist as CSS custom properties in `src/styles.css`.

Design read: consumer product-launch landing for Android + Windows users,
Apple-keynote premium-consumer language, native CSS + scroll reveals +
characterful type. Dials: VARIANCE 7 / MOTION 6 / DENSITY 3.

## Product truth (what the site may claim)

Source: `android-continuity/PROTOCOL.md`, `DECISIONS.md`. Reference only.

- Clipboard text + images, both directions, history on both sides. Android 10+
  focus rules mean one **Sync Now** tap after copying on the phone.
- Files either way in original quality (64 KB chunks, SHA-256 verified).
- Notifications from any notifying app surface on Windows with inline
  **reply + dismiss** (Android notification-listener, revocable any time).
- Phone as remote: trackpad (~60 Hz deltas), left/right click, natural
  two-finger scroll, typed text + Enter/Backspace/Space, media
  play-pause/next/previous/volume/mute, sensitivity 0.5–3.0 (default 1.8).
- Phone as wireless HD webcam over WebRTC on the same LAN
  (shows as “Bridge Phone Camera”, front/back switch).
- Ring phone ~15 s at max volume even on silent + live battery (event-driven).
- Pairing: QR holds IP + port + fresh 256-bit secret; everything after is
  AES-256-GCM over Socket.IO on port 4000. Keys in OS keychain / Keystore.
- No account, no cloud, no tracking. Same Wi-Fi required.
- Needs Windows 10/11 + Android 8.0+.
- **Do not claim phone-as-microphone.** `mic-signal` is parked in the protocol.

## Color

Cold luxury direction. One accent, locked across the whole page.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F2F3F5` | page background (cool silver-grey) |
| `--surface` | `#FFFFFF` | raised surfaces, inputs |
| `--wash` | `#E8EAEF` | sunken wells, demo stages, bands |
| `--ink` | `#0E1116` | primary text, primary buttons, closing panel |
| `--ink-2` | `#4B5260` | secondary text |
| `--ink-3` | `#7C8494` | tertiary text, captions |
| `--line` | `#E0E3E9` | hairlines, borders |
| `--line-strong` | `#CBCFDA` | borders on hover / emphasis |
| `--accent` | `#2743E3` | links, live states, focus rings (electric cobalt) |
| `--accent-deep` | `#1D34B0` | link hover |
| `--accent-wash` | `#E9EDFE` | accent tint behind live badges |
| `--ok` | `#1F7A4D` | success checks only |
| `--bad` | `#B3261E` | errors only |

Rules: body text is never gray-on-color. Primary buttons are ink.
No gradients, no glows. Tinted shadows only.

Flutter mapping: `paper 0xFFF2F3F5`, `ink 0xFF0E1116`, `ink2 0xFF4B5260`,
`ink3 0xFF7C8494`, `line 0xFFE0E3E9`, `accent 0xFF2743E3`.

## Type

Display: **Space Grotesk** (self-hosted variable via Fontsource,
`font-display: swap`). Headlines only: hero statement, section titles,
chapter indexes. Tracking `-0.03em`, weight 500–600, `text-wrap: balance`.
The hero statement is uppercase (Nothing.tech device, deliberate exception);
everything else is sentence case. No em-dashes.

Body: system stack (`-apple-system, Segoe UI, Roboto…`), 16–18px/1.6,
max ~65ch. Mono (step numbers, stats, hashes): system mono,
`tabular-nums` for figures. Sentence case everywhere. No em-dashes.

Scale: hero 52–60/1.02, section 32–36/1.12, chapter 24–28/1.2.

## Spacing / layout

4pt base. Page max `1120px`, padding 24 (18 phones). Section rhythm
120px desktop / 76px phone. Layout families rotate (split, band,
stacked film, hairline rows). Max 2 zigzag splits in a row. Eyebrows:
max 1 per 3 sections (hero + trust only).

## Radius

Documented rule: buttons full-pill, media 18px, disclosures 14px,
closing panel 28px. Nothing else rounds.

## Motion

`--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. Enter 280 ms opacity +
max 12 px rise, stagger 60 ms. One marquee per page (capability ticker,
slow, pauses on hover). The film section is scroll-driven storytelling:
a sticky visual crossfades between acts as the reader scrolls (driven by
IntersectionObserver, never scroll listeners). Videos autoplay muted loop,
pause off-screen and when their act is inactive, frozen under
`prefers-reduced-motion`. Every autoplaying video carries a muted-attribute
ref for Safari/iOS, which ignore the React muted property. Focus ring:
3px accent wash.

## Voice

Short, confident, specific. Numbers with units beat adjectives.
One CTA label per intent per mode: “Join the waitlist” everywhere in
waitlist mode; OS-specific download labels in public mode.
