# Bridge Website Redesign — Light, System-Grade, Product-Aligned

## Context

Real user feedback: *"Nice idea. I would focus on the landing page > fonts, icons etc."* The site currently reads as AI-generated. Research shows why:

- **The website doesn't match the product.** `bridge/android-continuity` (Flutter theme `bridge_theme.dart` + agent `style.css`) is calm, light, system-grade: bg `#F8FAFC`, white cards, borders `#E2E8F0`, one trustworthy blue `#0B57D0`, ink `#0F172A` — with an explicit rule: *"No gradients, no purple glows."* The website is the opposite: near-black `#060607`, blue/mint gradient text, grain noise, cursor glow, marquee, shimmer buttons.
- **No design system discipline:** 1333-line `styles.css` with ad-hoc radii (4→28px), ad-hoc card paddings (20–32px), 33 inline `style={{}}` in JSX, ~250 lines dead CSS, hard-coded `#c4d3ff` bypassing tokens.
- **Icons:** 16 hand-rolled SVGs of uneven quality + literal `☰/✕` text chars in the mobile menu.
- **Bugs:** `/privacy` imported but never routed (renders Home); `TOUR_VIDEOS[4]` points to missing `texts.mp4`; nav uses `<a href>` (full reloads) despite react-router.

**Chosen direction (user-confirmed):** Light system-grade matching the app · Full redesign + refactor · Lucide icons.

---

## 1. Design tokens (rewrite `:root`)

Colors — taken directly from the product's own theme:

```css
--bg: #F8FAFC;          /* slate-50, app bg */
--surface: #FFFFFF;     /* cards */
--surface-2: #F1F5F9;   /* alternating sections, inset tracks */
--border: #E2E8F0;
--border-strong: #CBD5E1;
--text: #0F172A;        /* ink */
--text-2: #475569;
--text-3: #64748B;
--muted: #94A3B8;
--primary: #0B57D0;     /* the one accent */
--primary-hover: #0842A0;
--primary-soft: #E8F0FE;
--success: #16A34A; --success-soft: #E6F4EA;
--warning: #B45309;
--danger: #B3261E;
```

Radii (app uses 12–20dp): `--r-sm: 8px · --r-md: 12px · --r-lg: 16px · --r-xl: 20px · --r-pill: 999px`.

Spacing: strict 4px base — section padding `112px 0` desktop / `72px` mobile; card padding `24px`; gaps from `8/12/16/24/32/48/64`.

Shadows: slate-tinted, minimal — `0 1px 2px rgba(15,23,42,.06)`; cards are border-first, shadow only on hover/featured.

## 2. Typography (the "fonts" feedback)

- **Keep Inter** (already correct for pro products — Notion/Linear class) but apply it with discipline:
  - Load only `400;500;600;700` (+ opsz), drop the odd `450`.
  - H1: `clamp(40px, 6vw, 64px)`, weight **600**, tracking `-0.022em` (current `-0.045em` is too fashion-y), lh 1.08.
  - H2: `clamp(28px, 4vw, 40px)/600/-0.02em`; body 16/1.65; sub 18px `--text-2`; card copy 14–15px.
  - **Kill gradient text** (`.grad`) — solid ink headings.
- **JetBrains Mono**: demoted to *technical data only* (version, SHA-256, permission code column, protocol pills). No more mono-uppercase-mint eyebrows — replace `.eyebrow` with a plain `13px/600` label in `--primary` or drop where the heading is self-explanatory.

## 3. Kill the AI tropes

Remove entirely: `.grain` noise overlay · `#cursor-glow` · `.hero-beams`/`.hero-grid` · `.btn-specular` shimmer → solid `--primary` button + outline secondary · `.grad`/`.rotator-word` gradient text · **marquee** · mint/iris decorative glow borders. Accent used sparingly and semantically (success = yes/checks, danger = old-way, primary = actions/highlight).

## 4. Icons → `lucide-react`

- Add dependency `lucide-react` (tree-shakeable, standard set).
- Replace all 16 hand-rolled `Icon*` components: Clipboard, Image, MessageSquare, MousePointer2, Camera, Bell, Link, ShieldCheck, Home, KeyRound, FileText, ChevronDown, Menu, X, Check, Minus, QrCode, Wifi, Lock, Download, Smartphone, BatteryMedium, etc.
- Keep custom: `Logo`, `WindowsGlyph`, `AndroidGlyph` (Lucide excludes brand marks).
- Uniform: size 20 default, one stroke weight everywhere; mobile menu gets real Menu/X icons.

## 5. Refactor `App.tsx` (1004 lines → components)

```
src/
  App.tsx              # router + route table only
  data/site.ts         # FAQS, PERMS, TOUR tabs, moments/features arrays
  hooks.ts             # useReveal, useSectionScroll
  components/
    Logo, Nav, Hero, SectionHead, Moments, Story, Features,
    Tour, TourVideo, Setup, Reviews, Security, Permissions,
    Compare, Signup, FAQ, FinalCTA, Footer, WaitlistForm
  styles.css           # full rewrite (zero-dep plain CSS kept)
```

- Section `id`s and route table unchanged → all deep links (`/tour`, `/faq`, …) keep working.
- Nav switches to react-router `<Link>` (no full reloads).

## 6. Section-by-section restyle

| Section | Change |
|---|---|
| **Nav** | Floating dark pill → full-width light bar: `rgba(255,255,255,.85)` + `blur(12px)`, 1px bottom border, 64px, links 14/500 `--text-2`, solid blue CTA |
| **Hero** | Light bg + one very subtle `--primary-soft` radial. Confident static subhead (product line: *"…over your own Wi-Fi, encrypted end to end. Nothing leaves your network."*). CTAs: solid blue + outline. Trust row: Check icons + plain text (no glowing chips). Product visual: existing tour video or still inside a light browser/phone frame. Drop marquee/version-pill overload |
| **Moments/Story/Features** | White cards, border-only, hover → `--border-strong` + light shadow; icon tiles `--primary-soft` bg / `--primary` icon (app pattern); bento gets hierarchy — first card `.wide` (modifier exists, never used); `--text-3` footers not mint |
| **Tour** | Dock → light segmented control (`--surface-2` track, white active pill + border); white panel |
| **Setup/Reviews/Security** | Numbered `--primary-soft` circles; quotes left-border `--primary`, sizes via classes not inline; security tiles `--success-soft`/`--success` |
| **Permissions/Compare** | Keep table; pills neutral; Bridge column `--primary-soft` + primary accent; Check=green, Minus=muted gray |
| **Signup** | White form card, 2px `--primary` focus ring; Windows download card featured with primary border (no glow) |
| **FAQ** | Border-divider accordion (Stripe/Linear pattern) instead of boxed items |
| **Final CTA** | Solid `--primary` panel, white text — strong and product-like (no iris radial) |
| **Footer** | `--surface-2` + top border, clean 4-col, 14px links |
| **Privacy** | Adopt shared tokens (currently a third, unrelated palette); **add missing `<Route path="/privacy">`** |

## 7. Bug fixes bundled in

1. Route `/privacy` properly.
2. Remove missing `texts.mp4` from `TOUR_VIDEOS` (CSS mock fallback already exists).
3. Delete ~250 lines dead CSS via full rewrite of `styles.css`.
4. Eliminate all 33 inline `style={{}}` → classes.
5. `index.html`: `theme-color` → `#F8FAFC`, trimmed font URL, keep Inter+Mono links minimal.

## 8. Implementation order

1. `npm i lucide-react`; extract components/data/hooks **without visual change** → `npm run build` green.
2. Rewrite `styles.css` with new tokens (reset, type, buttons, surfaces).
3. Restyle top-down: Nav → Hero → all sections → footer.
4. Swap icons to Lucide; delete old `Icon*` components.
5. Bug fixes (privacy route, video ref, `<Link>`).
6. `index.html` + Privacy page alignment.
7. Verify: `npm run build` (tsc strict) + `npm run dev` visual pass at 1440px and 375px, both `LAUNCH_MODE` values.

## Out of scope / follow-ups

- No Tailwind/UI deps — keep zero-dependency plain CSS convention.
- `og.png`/favicon are dark-themed → regenerate manually later (asset work).
- If product screenshots exist in `android-continuity/brag-output`, optionally swap into hero; otherwise tour videos suffice.
