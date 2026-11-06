import { notFound } from "next/navigation";
import { articles } from "@/data/air";
import { Badge, ButtonLink, PageHeading } from "@/components/air/brand";
import { ViewEvent } from "@/components/air/editorial";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <main id="main-content" className="air-container air-section">
      <ViewEvent event="article_opened" id={a.id} />
      <article className="air-article">
        <Badge>Demo content · {a.type}</Badge>
        <PageHeading eyebrow="Massachusetts / Wireless" title={a.title}>
          {a.dek}
        </PageHeading>
        <p className="air-fine">
          {a.author} · November 6, 2026 · Sample publication date
        </p>
        {a.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <h2>Sources & provenance</h2>
        <p>
          This is an editorial sample, not verified reporting. No carrier
          requests, project announcements or transactions are asserted.
        </p>
        {a.sources.map((s) => (
          <p key={s.sourceName}>
            {s.sourceName} · {s.observedAt} ·{" "}
            {s.isSynthetic ? "Synthetic" : "External source"}
            {s.sourceUrl && <a href={s.sourceUrl}>View source</a>}
          </p>
        ))}
        <h2>What this means for landlords</h2>
        <p>
          Start with known property attributes. Record missing evidence and
          obtain qualified structural, zoning and legal advice before offering a
          site.
        </p>
        <ButtonLink href="/app">Explore Massachusetts Wireless →</ButtonLink>
      </article>
    </main>
  );
}
