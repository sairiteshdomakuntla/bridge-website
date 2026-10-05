import { Download } from 'lucide-react';
import { IS_WAITLIST, SITE } from '../config';
import WaitlistForm from '../WaitlistForm';
import SectionHead from './SectionHead';
import { WindowsGlyph, AndroidGlyph } from './brand';

function DownloadGrid() {
  return (
    <>
      <div className="dl-need-both reveal">
        <b>Bridge needs both halves.</b>
        <span>Install the Windows app on your PC <i>and</i> the Android app on your phone, join the same Wi-Fi, then scan once. Either one alone does nothing.</span>
      </div>
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
              <div className="file">Android 8.0 and up · v{SITE.appVersion} · Google Play</div>
            </div>
          </div>
          <ul>
            <li>Copy anything to your PC in one tap</li>
            <li>Share any photo or file to your PC</li>
            <li>Remote, camera and ring-my-phone included</li>
          </ul>
          <a className="btn btn-ghost btn-block" href={SITE.playStoreUrl} target="_blank" rel="noreferrer">
            <Download size={16} /> Get it on Google Play · Free
          </a>
          <p className="dl-play-note">Testing link: tap <b>Become a tester</b>, then <b>Install</b>. Takes under a minute.</p>
        </div>
      </div>
      <div className="dl-note reveal">
        <b>First time? Read this once.</b>
        <ol>
          <li><b>On your phone:</b> open the Play link, join testing, install Bridge.</li>
          <li><b>On your PC:</b> install Bridge for Windows. If Windows asks “Run anyway?” — normal for new apps. Click “More info”, then “Run anyway”.</li>
          <li><b>Firewall asks about private networks.</b> Click Allow, or your phone cannot find the PC.</li>
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
              'You need both apps: Bridge for Windows on your PC and Bridge on your phone. Two minutes, same Wi-Fi, one scan.'
            )
          }
        />
        {IS_WAITLIST ? <WaitlistGrid /> : <DownloadGrid />}
      </div>
    </section>
  );
}
