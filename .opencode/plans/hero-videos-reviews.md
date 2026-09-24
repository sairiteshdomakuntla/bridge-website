# Homepage polish: 3-video hero + grounded tester notes + AI-copy pass

## Goals

1. Show **clipboard + files + camera** videos together on the homepage (both launch modes).
2. Rewrite **Early users** so it doesn't read as AI-generated fake quotes.
3. Sweep other sections for leftover AI-flavored copy.

---

## 1. Hero: 3-up video row (recommended placement)

**Why here:** Product proof above the fold is what real product sites do (Stripe, Linear, Notion). One video currently hides two of the three strongest features. Tour tabs keep the deeper dive (remote/texts stay tabbed).

### Changes — `src/components/Hero.tsx`

- Replace single `DemoVideo` with a `Showreel` row of three cards:

| Card | Video | Label | Caption |
|---|---|---|---|
| 1 | `/videos/clipboard.mp4` (512 KB) | Clipboard | Copy here, paste there |
| 2 | `/videos/file.mp4` (830 KB) | Files | Either way, original quality |
| 3 | `/videos/camera.mp4` (1.9 MB) | Camera | Phone as wireless webcam |

- Each card: white surface, 1px border, rounded, `overflow: hidden`, label row under the video (small icon + name + one-line caption).
- **Playback best practice:**
  - `muted` `loop` `playsInline` `preload="metadata"`
  - IntersectionObserver: `play()` when ≥40% visible, `pause()` when scrolled away (keeps 3 videos from burning CPU off-screen).
  - `onError` → hide that card gracefully (grid collapses to 2/1).
- Same markup for waitlist + public (Hero already renders in both).

### Changes — `src/styles.css`

- `.hero-showreel` — `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 960px; margin: 56px auto 0`.
- `.showreel-card` — surface, border, radius-lg, shadow-sm; hover subtle lift.
- `.showreel-card video` — `aspect-ratio: 16/10; object-fit: cover; width: 100%; background: surface-2`.
- `.showreel-meta` — flex row: 28px icon tile (primary-soft) + title (14px/600) + caption (13px text-3).
- Responsive: ≤900px → horizontal scroll-snap row (peek next card, App Store style) or 1-col stack ≤560px — pick scroll-snap for mobile so all three stay reachable without a tall page.
- Remove now-unused `.hero-demo` rules (or repurpose).

### Unchanged

- Tour section keeps its tabbed videos (including remote + texts mock) — no duplication issue: Tour is the “deep dive”, hero is the “glance”.

---

## 2. Early users → grounded tester notes

**Problem today:** polished symmetric quotes, invented full names (“Aarav · Student”), headline *“Built for humans, not IT departments”* — reads template/AI.

### Changes — `src/components/Reviews.tsx`

- New heading: **“From people using it”** / thin: *“Early testers, in their words.”* (eyebrow stays “Early access” or “Testers”).
- Replace3 quote cards with **3 short tester notes** — concrete, slightly uneven, no marketing polish:

  Structure per card:
  - Note body (2–3 sentences, specific workflow detail, lowercase-ish casual register where natural)
  - Attribution: **first name + role only** (no · separator styling theatrics), small muted text
  - Optional tiny context tag (e.g. “week 2”)

- Copy direction (final wording in implementation, tone targets):
  1. Student-ish user — clipboard killed the WhatsApp-to-self habit for Figma/Docs links.
  2. Designer/creative — screenshots into Photoshop full quality; replies from keyboard.
  3. Engineer/maker — phone camera as webcam for showing hardware/desk on calls.
- **No** big pull-quote `h3` headlines inside cards — the note *is* the content; heading weight drops so it doesn’t shout “TESTIMONIAL TEMPLATE”.
- Keep `public`-only gating (unchanged) unless build reveals otherwise — waitlist page stays focused.

### Changes — `src/styles.css` `.cr-card.quote`

- Softer treatment: left border 2px `--border-strong` (or none + icon), remove heavy primary bar if it feels salesy; padding consistent; `.who` 13px `--text-3` `500`.
- Grid stays 3-col desktop → 1-col mobile.

---

## 3. AI-copy sweep (other sections)

Light touch — keep voice that’s already distinctive (“Stop WhatsApping yourself”):

| Location | Current | Change to |
|---|---|---|
| `Faq.tsx` eyebrow | “Questions, answered simply” | “FAQ” |
| `Compare.tsx` eyebrow | “Honest comparison” | “Comparison” |
| `Features.tsx` desc | “Six tools in one quiet app. No dashboard to babysit.” | “Six tools. No account, no cloud, no dashboard to babysit.” → actually keep second half; tighten to **“Six tools that stay out of your way.”** |
| `Security.tsx` desc | “No account. No cloud. No tracking. Your stuff moves…” | **“No account and no cloud — your stuff moves directly between your two devices, nowhere else.”** (less staccato robot rhythm) |
| `Signup.tsx` waitlist desc | long clausal sentence | fine, leave |
| `FinalCTA.tsx` | fine | leave |

Do **not** rewrite Moments/Story/Setup — those already sound human.

---

## 4. Files touched

| File | Change |
|---|---|
| `src/components/Hero.tsx` | 3-video Showreel + viewport play/pause hook |
| `src/components/Reviews.tsx` | Grounded tester notes, new heading |
| `src/components/Faq.tsx` | Eyebrow |
| `src/components/Compare.tsx` | Eyebrow |
| `src/components/Features.tsx` | Desc line |
| `src/components/Security.tsx` | Desc line |
| `src/styles.css` | `.hero-showreel` / `.showreel-card`; adjust `.cr-card.quote`; remove `.hero-demo` if unused |

No route/config changes. No new dependencies.

## 5. Verify

1. `npm run build` (tsc strict).
2. Dev server: homepage shows 3 videos autoplaying in view, pausing when scrolled past.
3. Mobile width: scroll-snap or stacked row works.
4. One video error path: card hides, layout intact.
5. Public mode build (`VITE_LAUNCH_MODE=public`) still shows Reviews with new copy.
