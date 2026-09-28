import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  heading: ReactNode;
  desc?: ReactNode;
};

export default function SectionHead({ eyebrow, heading, desc }: Props) {
  return (
    <div className={`sec-head reveal${eyebrow ? ' has-eyebrow' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{heading}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}
