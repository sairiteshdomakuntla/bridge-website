import { Download, Bell } from 'lucide-react';
import { IS_WAITLIST, SITE } from '../config';
import WaitlistForm from '../WaitlistForm';
import SectionHead from './SectionHead';
import { WindowsGlyph, AndroidGlyph } from './brand';

function DownloadGrid() {
  return (
    <>
      <div className="dl-grid">
        <div className="dl-card featured reveal">
          <div className="os">
            <div className="glyph win"><WindowsGlyph size={24} /></div>
            <div>
              <h3>For Windows</h3>
              <div className="file">Windows 10 / 11 · 64-bit</div>
            </div>
          </div>
          <ul>
            <li>Shows the code that connects your phone</li>
            <li>Clipboard history + reply to texts</li>
            <li>Home for your files, camera and remote</li>
          </ul>
          <a className="btn btn-primary btn-block" href={SITE.windowsDownloadUrl} download={SITE.windowsInstaller}>
            <Download size={16} /> Download for Windows · {SITE.windowsSize}
          </a>
        </div>
        <div className="dl-card reveal">
          <div className="os">
            <div className="glyph droid"><AndroidGlyph size={24} /></div>
            <div>
              <h3>For Android</h3>
              <div className="file">Android 8.0+ · v{SITE.appVersion}</div>
            </div>
          </div>
          <ul>
            <li>Copy anything to your PC in one tap</li>
            <li>Share any photo or file to your PC</li>
            <li>Remote, camera and ring-my-phone included</li>
          </ul>
          <a className="btn btn-ghost btn-block" href={SITE.androidDownloadUrl} download={SITE.androidApk}>
            <Download size={16} /> Download for Android · {SITE.androidSize}
          </a>
        </div>
      </div>
      <div className="dl-note reveal">
        <b>First time? Read this once:</b>
        <ol>
          <li><b>Windows asks “Run anyway?”</b> — normal for new apps. Click “More info → Run anyway”.</li>
          <li><b>Firewall asks about private networks</b> — click Allow, or your phone can’t find the PC.</li>
          <li><b>Android asks to allow installs</b> — allow once for your browser, then install.</li>
          <li><b>Connect:</b> open Bridge on PC, scan the code with your phone. Done.</li>
        </ol>
      </div>
    </>
  );
}

function WaitlistGrid() {
  return (
    <>
      <div className="dl-grid">
        <WaitlistForm />
        <div className="dl-card reveal in">
          <div className="os">
            <div className="glyph droid"><Bell size={22} /></div>
            <div>
              <h3>How early access works</h3>
              <div className="file">small batches · invite by email</div>
            </div>
          </div>
          <ul className="wl-side-list">
            <li>Join the waitlist with your email — 20 seconds</li>
            <li>We send Windows + Android install links when your spot opens</li>
            <li>Install both apps, join the same Wi-Fi, scan once</li>
            <li>Free during v1 · no account · leave any time</li>
          </ul>
        </div>
      </div>
      <div className="dl-note reveal in">
        <b>Why a waitlist?</b> Bridge pairs your real phone and PC over your Wi-Fi — we’re onboarding gradually so
        every early user gets a smooth setup. Your email is only used for your invite.
      </div>
    </>
  );
}

export default function Signup() {
  return (
    <section className="block" id={IS_WAITLIST ? 'waitlist' : 'download'}>
      <div className="wrap">
        <SectionHead
          eyebrow={IS_WAITLIST ? 'Early access · waitlist open' : `Get Bridge · v${SITE.appVersion} · free`}
          heading={
            IS_WAITLIST ? (
              <>
                Get early access. <span className="thin">Join the waitlist.</span>
              </>
            ) : (
              <>
                Two installs. <span className="thin">Two minutes.</span>
              </>
            )
          }
          desc={
            IS_WAITLIST ? (
              'Bridge is currently accepting early users in small batches — leave your email and we’ll send your install links.'
            ) : (
              <>
                You need <b>both</b> — one on your PC, one on your phone — on the same Wi-Fi.
              </>
            )
          }
        />
        {IS_WAITLIST ? <WaitlistGrid /> : <DownloadGrid />}
      </div>
    </section>
  );
}
