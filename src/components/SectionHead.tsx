import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  heading: ReactNode;
  desc?: ReactNode;
  center?: boolean;
};

export default function SectionHead({ eyebrow, heading, desc, center }: Props) {
  return (
    <div className={`sec-head${center ? ' center' : ''} reveal`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{heading}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}
