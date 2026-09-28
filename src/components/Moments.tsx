const TICKER = [
  'Clipboard both ways',
  'Files in original quality',
  'Reply from your keyboard',
  'Phone as webcam',
  'Remote and media keys',
  'Ring on silent',
];

function TickerRow({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden || undefined}>
      {TICKER.map((t) => (
        <span key={t}>
          {t} <i>·</i>
        </span>
      ))}
    </span>
  );
}

export default function Moments() {
  return (
    <>
      <div className="proof" id="moments">
        <div className="wrap proof-row reveal">
          <div><b>No account</b>Pair with a QR scan. Nothing to sign into.</div>
          <div><b>Stays on your Wi-Fi</b>Encrypted end to end. No cloud relay.</div>
          <div><b>2-minute setup</b>Install both apps, scan once, done.</div>
          <div><b>Free during v1</b>Early users keep it free. No catch.</div>
        </div>
      </div>
      <div className="marquee" aria-label="Everything Bridge does">
        <div className="marquee-track">
          <TickerRow />
          <TickerRow hidden />
        </div>
      </div>
    </>
  );
}
