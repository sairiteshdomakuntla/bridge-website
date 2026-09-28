import SectionHead from './SectionHead';

export default function Compare() {
  return (
    <section className="block" id="compare">
      <div className="wrap">
        <SectionHead
          heading={<>Bridge, Phone Link, KDE Connect.</>}
          desc="The honest table. Phone Link needs an account and the internet. KDE Connect is powerful but fiddly. Bridge is the simple one."
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
              <tr><td>Account required</td><td className="bcol">None</td><td>Microsoft account</td><td>None</td></tr>
              <tr><td>Works fully offline, no cloud relay</td><td className="bcol">Yes</td><td>No, needs internet</td><td>Yes</td></tr>
              <tr><td>Pairing effort</td><td className="bcol">10-second scan</td><td>Sign-in, codes, retries</td><td>Manual accept both sides</td></tr>
              <tr><td>Clipboard text and images, both directions</td><td className="bcol">Yes</td><td>Text only, Samsung-limited</td><td>Yes</td></tr>
              <tr><td>Notification reply from PC, any app</td><td className="bcol">Yes</td><td>Mostly Samsung devices</td><td>Partial</td></tr>
              <tr><td>Trackpad, keyboard, media keys</td><td className="bcol">Yes</td><td>No</td><td>Partial, via plugins</td></tr>
              <tr><td>Phone as PC webcam</td><td className="bcol">Yes, wireless HD</td><td>No</td><td>Via plugins</td></tr>
              <tr><td>Send files either way, original quality</td><td className="bcol">Yes, both directions</td><td>Photos only</td><td>Yes</td></tr>
              <tr><td>Ring phone on silent, live battery</td><td className="bcol">Yes</td><td>No</td><td>Partial</td></tr>
              <tr><td>Every permission documented</td><td className="bcol">This page</td><td>No</td><td>No</td></tr>
              <tr><td>Telemetry, data leaves network</td><td className="bcol">None, ever</td><td>Account-linked diagnostics</td><td>None</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
