import { Download } from 'lucide-react';
import { IS_WAITLIST, SITE } from '../config';
import WaitlistForm from '../WaitlistForm';
import SectionHead from './SectionHead';
import { WindowsGlyph, AndroidGlyph } from './brand';

function DownloadGrid() {
  return (
    <>
      <div className="signup-grid">
        <div className="dl-card reveal">
          <div className="dl-os">
            <div className="glyph"><WindowsGlyph size={22} /></div>
            <div>
              <h3>For Windows</h3>
              <div className="file">Windows 10 / 11 · 64-bit</div>
            </div>
          </div>
          <ul>
            <li>Shows the code that connects your phone</li>
            <li>Clipboard history plus reply to texts</li>
            <li>Home for your files, camera and remote</li>
          </ul>
          <a className="btn btn-primary btn-block" href={SITE.windowsDownloadUrl} download={SITE.windowsInstaller}>
            <Download size={16} /> Download for Windows · {SITE.windowsSize}
          </a>
        </div>
        <div className="dl-card reveal">
          <div className="dl-os">
            <div className="glyph"><AndroidGlyph size={22} /></div>
            <div>
              <h3>For Android</h3>
              <div className="file">Android 8.0 and up · v{SITE.appVersion}</div>
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
        <b>First time? Read this once.</b>
        <ol>
          <li><b>Windows asks “Run anyway?”</b> Normal for new apps. Click “More info”, then “Run anyway”.</li>
          <li><b>Firewall asks about private networks.</b> Click Allow, or your phone cannot find the PC.</li>
          <li><b>Android asks to allow installs.</b> Allow once for your browser, then install.</li>
          <li><b>Connect.</b> Open Bridge on the PC, scan the code with your phone. Done.</li>
        </ol>
      </div>
    </>
  );
}

function WaitlistGrid() {
  return (
    <>
      <div className="signup-grid">
        <WaitlistForm />
        <div className="dl-card reveal in">
          <div className="dl-os">
            <div className="glyph">→</div>
            <div>
              <h3>How early access works</h3>
              <div className="file">small batches · invite by email</div>
            </div>
          </div>
          <ul className="wl-side-list">
            <li>Join the waitlist with your email. Twenty seconds.</li>
            <li>Install links arrive with your invite</li>
            <li>Install both apps, join the same Wi-Fi, scan once</li>
            <li>Free during v1. No account. Leave any time.</li>
          </ul>
        </div>
      </div>
      <div className="dl-note reveal in">
        <b>Why a waitlist?</b> Bridge pairs your real phone and PC over your Wi-Fi. We are onboarding
        gradually so every early user gets a smooth setup. Your email is only used for your invite.
      </div>
    </>
  );
}

export default function Signup() {
  return (
    <section className="block" id={IS_WAITLIST ? 'waitlist' : 'download'}>
      <div className="wrap">
        <SectionHead
          heading={
            IS_WAITLIST ? (
              <>Save your spot.</>
            ) : (
              <>Get Bridge.</>
            )
          }
          desc={
            IS_WAITLIST ? (
              'Early access is rolling in small batches. Leave your email and your install links arrive with your invite.'
            ) : (
              'Two installs, two minutes, zero accounts. Free during v1.'
            )
          }
        />
        {IS_WAITLIST ? <WaitlistGrid /> : <DownloadGrid />}
      </div>
    </section>
  );
}
