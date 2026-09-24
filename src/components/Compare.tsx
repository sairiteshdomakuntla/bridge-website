import SectionHead from './SectionHead';

export default function Compare() {
  return (
    <section className="block" id="compare">
      <div className="wrap">
        <SectionHead
          eyebrow="Comparison"
          heading={
            <>
              How Bridge <span className="thin">stacks up.</span>
            </>
          }
        />
        <div className="compare reveal">
          <table>
            <thead>
              <tr>
                <th></th>
                <th className="bridge-col">Bridge</th>
                <th>Phone Link</th>
                <th>KDE Connect</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Account required</td><td className="bcol">None</td><td className="mid">Microsoft account</td><td className="yes">None</td></tr>
              <tr><td>Works fully offline, no cloud relay</td><td className="bcol">Yes</td><td className="no">No — needs internet</td><td className="yes">Yes</td></tr>
              <tr><td>Pairing effort</td><td className="bcol">10-second scan</td><td className="mid">Sign-in + codes + retries</td><td className="mid">Manual accept on both sides</td></tr>
              <tr><td>Clipboard text + images, both directions</td><td className="bcol">Yes</td><td className="mid">Text only, Samsung-limited</td><td className="yes">Yes</td></tr>
              <tr><td>Notification reply from PC, any app</td><td className="bcol">Yes</td><td className="mid">Mostly Samsung devices</td><td className="mid">Partial</td></tr>
              <tr><td>Trackpad + keyboard + media keys</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial, via plugins</td></tr>
              <tr><td>Phone as PC webcam</td><td className="bcol">Yes, wireless HD</td><td className="no">—</td><td className="mid">Via plugins</td></tr>
              <tr><td>Send files either way, original quality</td><td className="bcol">Yes, both directions</td><td className="mid">Photos only</td><td className="yes">Yes</td></tr>
              <tr><td>Ring phone on silent + live battery</td><td className="bcol">Yes</td><td className="no">—</td><td className="mid">Partial</td></tr>
              <tr><td>Every permission documented</td><td className="bcol">This page</td><td className="no">—</td><td className="no">—</td></tr>
              <tr><td>Telemetry / data leaves network</td><td className="bcol">None, ever</td><td className="mid">Account-linked diagnostics</td><td className="yes">None</td></tr>
            </tbody>
          </table>
        </div>
        <p className="compare-note reveal">
          Phone Link needs an account and the internet. KDE Connect is powerful but fiddly. Bridge is the simple
          one: paired in seconds, with the extras neither of them bundles.
        </p>
      </div>
    </section>
  );
}
