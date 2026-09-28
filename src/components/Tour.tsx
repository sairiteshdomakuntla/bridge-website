import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMutedRef } from '../hooks';
import SectionHead from './SectionHead';

type Act = {
  n: string;
  title: string;
  body: string;
  steps: ReactNode[];
  note: string;
  video: string;
  videoLabel: string;
  mockKey?: 'texts' | 'remote' | 'camera' | 'clipboard' | 'files';
};

const ACTS: Act[] = [
  {
    n: '01 / Clipboard',
    title: 'Copy here. Paste there.',
    body: 'Links, screenshots, IDs. Anything you copy travels both ways, with history on both sides.',
    steps: [
      <span key="1">Copy in <b>any app</b>, on either device</span>,
      <span key="2">Tap <b>Sync Now</b> once on the phone</span>,
      <span key="3">Paste with <b>Ctrl+V</b> or tap Paste</span>,
    ],
    note: 'Text and images · nothing uploaded',
    video: '/videos/clipboard.mp4',
    videoLabel: 'clipboard · copy to paste',
    mockKey: 'clipboard',
  },
  {
    n: '02 / Files',
    title: 'Never send a file to yourself again.',
    body: 'Photos, videos and PDFs land in original quality. Share from any app, or send from the PC.',
    steps: [
      <span key="1"><b>Share</b> from any app and choose Bridge</span>,
      <span key="2">Or send from the <b>Windows dashboard</b></span>,
      <span key="3"><b>Verified on arrival</b>, progress both sides</span>,
    ],
    note: '64 KB chunks · SHA-256 verified',
    video: '/videos/file.mp4',
    videoLabel: 'files · phone to PC',
    mockKey: 'files',
  },
  {
    n: '03 / Texts',
    title: 'Type at full speed.',
    body: 'WhatsApp, Telegram, SMS. Messages land on Windows the moment they hit your phone.',
    steps: [
      <span key="1"><b>Reply inline</b> from your real keyboard</span>,
      <span key="2"><b>Dismiss</b> the noise without touching the phone</span>,
      <span key="3">Switch it off any time. <b>Mirroring stops dead.</b></span>,
    ],
    note: 'Notification listener · revocable in Settings',
    video: '',
    videoLabel: '',
    mockKey: 'texts',
  },
  {
    n: '04 / Remote',
    title: 'Couch. Back row. Control room.',
    body: 'Trackpad, keyboard, media keys. Scroll docs, flip slides, pause the film.',
    steps: [
      <span key="1"><b>Two-finger scroll</b>, left and right click</span>,
      <span key="2"><b>Enter, Backspace, Space</b> plus typed text</span>,
      <span key="3"><b>Play, next, volume, mute</b> from the phone</span>,
    ],
    note: 'Deltas near 60 Hz · same Wi-Fi, feels instant',
    video: '/videos/remote.mp4',
    videoLabel: 'remote · trackpad and media',
    mockKey: 'remote',
  },
  {
    n: '05 / Camera',
    title: 'Your best camera is the one in your pocket.',
    body: 'Bridge Phone Camera appears in Meet, Zoom and Teams like any other webcam. Front or back lens, one tap to switch.',
    steps: [
      <span key="1">Shows up as <b>Bridge Phone Camera</b> everywhere</span>,
      <span key="2">Small text and details <b>stay readable</b></span>,
      <span key="3"><b>Front or back lens</b>, switch in one tap</span>,
    ],
    note: 'WebRTC peer to peer · same LAN · nothing uploaded',
    video: '/videos/camera.mp4',
    videoLabel: 'camera · wireless HD',
    mockKey: 'camera',
  },
];

function Mock({ kind }: { kind: NonNullable<Act['mockKey']> }) {
  if (kind === 'texts') {
    return (
      <>
        <div className="notif-row">
          <div className="avatar">A</div>
          <div className="notif-body">
            <b>WhatsApp · Alice</b>
            <small>Send the Figma link when you are at your desk?</small>
          </div>
        </div>
        <div className="notif-row">
          <div className="avatar">T</div>
          <div className="notif-body">
            <b>Telegram · Design group</b>
            <small>Final mock is in Figma. Review?</small>
            <div className="reply">
              <input defaultValue="Looking now" readOnly aria-label="Reply preview" />
              <button type="button" tabIndex={-1}>Send</button>
            </div>
          </div>
        </div>
        <div className="stage-cap"><span>reply preview · staged</span><span className="mono">texts</span></div>
      </>
    );
  }
  if (kind === 'remote') {
    return (
      <>
        <div className="trackpad"><span className="cursor" /></div>
        <div className="mediakeys">
          <span>Play</span><span>Next</span><span>Vol +</span><span>Vol −</span><span>Mute</span>
        </div>
      </>
    );
  }
  if (kind === 'camera') {
    return (
      <div className="cam-view">
        <div className="cam-scene">
          <div className="cam-desk" />
          <div className="cam-plant" />
          <div className="cam-mug" />
          <div className="cam-note">desk feed</div>
        </div>
        <div className="cam-rec"><i />Live · 1080p · private link</div>
      </div>
    );
  }
  const rows =
    kind === 'clipboard'
      ? [
          { src: 'phone to pc', time: 'now', text: 'figma.com/design/Site-Revamp?node-id=4128…' },
          { src: 'pc to phone', time: '2m', text: 'upi://pay?pa=shop@okhdfc&am=499 …' },
        ]
      : [
          { src: 'phone to pc', time: 'now', text: 'design-specs.pdf · 4.2 MB · received' },
          { src: 'pc to phone', time: '1m', text: 'Offer-letter.pdf · sent to phone' },
        ];
  return (
    <>
      {rows.map((r) => (
        <div className="clip-card" key={r.text}>
          <div className="meta"><span className="src">{r.src}</span><span className="time">{r.time}</span></div>
          <p>{r.text}</p>
        </div>
      ))}
    </>
  );
}

/**
 * Hero film slot. Drop a 16:9 loop at public/videos/hero.mp4 and it plays
 * here automatically. Until then the clipboard capture holds the slot,
 * so the film section never shows an empty frame.
 */
const HERO_FILM_SRC = '/videos/hero.mp4';
const HERO_FILM_FALLBACK = '/videos/clipboard.mp4';

function HeroFilm() {
  const [src, setSrc] = useState(HERO_FILM_SRC);
  const [missing, setMissing] = useState(false);
  const muteRef = useMutedRef();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || missing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('autoplay');
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [missing, src]);

  const handleError = () => {
    if (src === HERO_FILM_SRC) setSrc(HERO_FILM_FALLBACK);
    else setMissing(true);
  };

  if (missing) {
    return (
      <div className="film-slot" role="img" aria-label="Placeholder for the hero film">
        <div className="dots" aria-hidden="true" />
        <div>
          <span className="mono">Hero film · 16:9 loop</span>
          <p>Desk scene: copy on the phone, paste on the laptop. One continuous take.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="film-frame">
      <video
        ref={(el) => {
          muteRef(el);
          (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el;
        }}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Bridge hero film"
        onError={handleError}
      />
    </div>
  );
}

function ActMedia({ act, on, muteRef, videoRef, index }: { act: Act; on: boolean; muteRef: (el: HTMLVideoElement | null) => void; videoRef: (i: number, el: HTMLVideoElement | null) => void; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`act-media${on ? ' on' : ''}`} aria-hidden={!on}>
      {act.video && !failed ? (
        <>
          <video
            ref={(el) => {
              muteRef(el);
              videoRef(index, el);
            }}
            className="tour-video"
            src={act.video}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={act.videoLabel}
            onError={() => setFailed(true)}
          />
          <div className="stage-cap"><span>{act.videoLabel}</span><span className="mono">live capture</span></div>
        </>
      ) : (
        <Mock kind={act.mockKey ?? 'clipboard'} />
      )}
    </div>
  );
}

export default function Tour() {
  const [active, setActive] = useState(0);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const muteRef = useMutedRef();

  useEffect(() => {
    const els = actRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.act ?? 0);
            setActive(i);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (reduce || i !== active) {
        v.pause();
      } else {
        v.play().catch(() => {});
      }
    });
  }, [active]);

  const setVideoRef = (i: number, el: HTMLVideoElement | null) => {
    videoRefs.current[i] = el;
  };

  return (
    <section className="block" id="tour">
      <div className="wrap">
        <SectionHead
          heading={<>Watch it work.</>}
          desc="Five flows, filmed on real devices. Scroll, and the story plays itself."
        />
        <HeroFilm />
      </div>

      <div className="acts">
        <div className="acts-copy">
          {ACTS.map((act, i) => (
            <div
              key={act.n}
              ref={(el) => {
                actRefs.current[i] = el;
              }}
              data-act={i}
              className={`act${active === i ? ' live' : ''}`}
            >
              <span className="chapter-index">{act.n}</span>
              <h3>{act.title}</h3>
              <p>{act.body}</p>
              <ul className="chapter-steps">
                {act.steps.map((s, j) => (
                  <li key={j}><span className="k">{j + 1}</span><span>{s}</span></li>
                ))}
              </ul>
              <p className="chapter-note">{act.note}</p>
            </div>
          ))}
        </div>
        <div className="acts-visual">
          <div className="acts-stage">
            <div className="acts-counter" aria-hidden="true">
              <span className="mono">0{active + 1} / 05</span>
              <span className="acts-rail">
                {ACTS.map((a, i) => (
                  <i key={a.n} className={i <= active ? 'on' : ''} />
                ))}
              </span>
            </div>
            <div className="acts-stack">
              {ACTS.map((act, i) => (
                <ActMedia key={act.n} act={act} index={i} on={i === active} muteRef={muteRef} videoRef={setVideoRef} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="extras reveal">
          <div>
            <span className="n">06 / Find phone</span>
            <b>Ring it, even on silent.</b>
            <p>Phone under a cushion? Ring it from your PC. About 15 seconds at max volume, with a full-screen stop button.</p>
          </div>
          <div>
            <span className="n">07 / Battery</span>
            <b>Glanceable, never naggy.</b>
            <p>Live battery level sits in your Windows dashboard. It updates when the level moves or charging flips.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
