import { useState, type ReactNode } from 'react';
import SectionHead from './SectionHead';

/* Demo videos live in public/videos/. If a file is missing (or fails to
   load), the styled mock below it renders instead — the page never breaks. */
const TOUR_VIDEOS = [
  '/videos/clipboard.mp4',
  '/videos/file.mp4',
  '/videos/camera.mp4',
  '/videos/remote.mp4',
  '', // texts.mp4 not shipped yet — always use the CSS mock
];

function TourVideo({ src, children }: { src: string; children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{children}</>;
  return (
    <video
      className="tour-video"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
    />
  );
}

const TABS = ['Clipboard', 'Files', 'Camera', 'Remote', 'Texts'];

export default function Tour() {
  const [tour, setTour] = useState(0);

  return (
    <section className="block" id="tour">
      <div className="wrap">
        <SectionHead
          center
          eyebrow="See it in action"
          heading={
            <>
              A normal day <span className="thin">with Bridge on.</span>
            </>
          }
        />
        <div className="dock reveal">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              className={tour === i ? 'active' : ''}
              onClick={() => setTour(i)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="tour-panel" key={tour}>
          {tour === 0 && (
            <>
              <div>
                <h3>
                  <span className="n">01 / CLIPBOARD</span>
                  Copy here. Paste there. Either way.
                </h3>
                <p>
                  The flow your hands learn in minutes. Links, screenshots, IDs, notes — phone to PC and PC to
                  phone, with history on both sides.
                </p>
                <ul className="tour-list">
                  <li>Copy something on either device, in any app</li>
                  <li>Tap Sync Now once on the phone</li>
                  <li>Paste on the other side — Ctrl+V or tap Paste</li>
                </ul>
              </div>
              <div className="tour-visual">
                <TourVideo src={TOUR_VIDEOS[0]}>
                  <div className="clip-card">
                    <div className="meta">
                      <span className="src">phone → pc</span>
                      <span className="time">now</span>
                    </div>
                    <p>figma.com/design/Site-Revamp?node-id=4128…</p>
                  </div>
                  <div className="clip-card">
                    <div className="meta">
                      <span className="src">pc → phone</span>
                      <span className="time">2m</span>
                    </div>
                    <p>upi://pay?pa=shop@okhdfc&amp;am=499 …</p>
                  </div>
                  <div className="visual-note">Both directions · history kept · nothing uploaded</div>
                </TourVideo>
              </div>
            </>
          )}
          {tour === 1 && (
            <>
              <div>
                <h3>
                  <span className="n">02 / FILES</span>
                  Share, don't WhatsApp yourself.
                </h3>
                <p>Photos, videos, PDFs in original quality — either direction. No cable, no compression, no drive upload.</p>
                <ul className="tour-list">
                  <li>Phone to PC: Share in any app, choose Bridge</li>
                  <li>PC to phone: send from the Windows dashboard</li>
                  <li>Progress shown on both sides, verified on arrival</li>
                </ul>
              </div>
              <div className="tour-visual">
                <TourVideo src={TOUR_VIDEOS[1]}>
                  <div className="clip-card">
                    <div className="meta">
                      <span className="src">phone → pc</span>
                      <span className="time">now</span>
                    </div>
                    <p>design-specs.pdf · 4.2 MB · received</p>
                  </div>
                  <div className="clip-card">
                    <div className="meta">
                      <span className="src">pc → phone</span>
                      <span className="time">1m</span>
                    </div>
                    <p>Offer-letter.pdf · sent to phone</p>
                  </div>
                  <div className="visual-note">Both directions · original quality</div>
                </TourVideo>
              </div>
            </>
          )}
          {tour === 2 && (
            <>
              <div>
                <h3>
                  <span className="n">03 / CAMERA</span>
                  Your meetings just got a better camera.
                </h3>
                <p>
                  Your phone becomes a wireless HD webcam — pick it in Meet, Zoom or Teams like any other camera.
                  Same desk, same light, no contest.
                </p>
                <ul className="tour-list">
                  <li>Shows up as “Bridge Phone Camera” everywhere</li>
                  <li>Notebook text and small details stay readable</li>
                  <li>Front or back lens, switch in one tap</li>
                </ul>
              </div>
              <div className="tour-visual cam-demo">
                <TourVideo src={TOUR_VIDEOS[2]}>
                  <div className="cam-view high">
                    <div className="cam-scene">
                      <div className="cam-desk" />
                      <div className="cam-plant" />
                      <div className="cam-mug" />
                      <div className="cam-note">desk feed</div>
                    </div>
                    <div className="cam-rec"><i />Live · 1080p · private link</div>
                  </div>
                  <div className="visual-note">Wireless HD · nothing uploaded</div>
                </TourVideo>
              </div>
            </>
          )}
          {tour === 3 && (
            <>
              <div>
                <h3>
                  <span className="n">04 / REMOTE</span>
                  The couch is now a control room.
                </h3>
                <p>Trackpad, keyboard, media keys. Scroll a doc, flip slides, pause the movie — phone in hand, feet up.</p>
                <ul className="tour-list">
                  <li>Trackpad with natural two-finger scroll</li>
                  <li>Keyboard tab + Enter / Backspace / Space</li>
                  <li>Play, next, volume, mute</li>
                </ul>
              </div>
              <div className="tour-visual">
                <TourVideo src={TOUR_VIDEOS[3]}>
                  <div className="trackpad"><span className="cursor" /></div>
                  <div className="mediakeys">
                    <span>Play</span><span>Next</span><span>Vol +</span><span>Vol −</span><span>Mute</span>
                  </div>
                  <div className="visual-note">Feels instant · same Wi-Fi</div>
                </TourVideo>
              </div>
            </>
          )}
          {tour === 4 && (
            <>
              <div>
                <h3>
                  <span className="n">05 / TEXTS</span>
                  Your chats, at full typing speed.
                </h3>
                <p>
                  Messages arrive on Windows the moment they hit your phone. Reply inline, dismiss the noise — the
                  phone never leaves your pocket.
                </p>
                <ul className="tour-list">
                  <li>WhatsApp, Telegram, SMS + any notifying app</li>
                  <li>Inline reply and dismiss from Windows</li>
                  <li>Turn it off any time — mirroring stops dead</li>
                </ul>
              </div>
              <div className="tour-visual">
                <div className="notif-row">
                  <div className="avatar">A</div>
                  <div>
                    <b>WhatsApp · Alice</b>
                    <small>Send the Figma link when you're at your desk?</small>
                  </div>
                </div>
                <div className="notif-row">
                  <div className="avatar tg">T</div>
                  <div className="notif-body">
                    <b>Telegram · Design group</b>
                    <small>Final mock is in Figma — review?</small>
                    <div className="reply">
                      <input defaultValue="Looking now" readOnly aria-label="Reply preview" />
                      <button type="button">Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
