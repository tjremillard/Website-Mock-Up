import type { ReactNode } from "react";
export function LinkButton({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <a className={secondary ? "button secondary" : "button"} href={"#" + to}>
      {children}
    </a>
  );
}
export function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="muted intro">{children}</p>}
    </div>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={"card " + className}>{children}</section>;
}
export function Progress({ stage }: { stage: number }) {
  return (
    <ol className="progress" aria-label="Review progress">
      {["Submitted", "AI analysis", "WRA review", "Completed"].map((s, i) => (
        <li
          key={s}
          className={i <= stage ? "done" : ""}
          aria-current={i === stage ? "step" : undefined}
        >
          {s}
        </li>
      ))}
    </ol>
  );
}
export function PropertyArt({ tone = "sage" }: { tone?: string }) {
  return (
    <div className={"property-art " + tone} aria-hidden="true">
      <svg viewBox="0 0 400 170" fill="none">
        <path
          d="M0 140H400M65 140V69L215 31V140M215 61H320V140M80 86L200 57M80 103L200 74M80 120L200 91M233 79H300M233 96H300M233 113H300"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M112 47L147 38V19H112V47M260 61V30M248 41Q260 28 272 41M241 33Q260 12 279 33"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
