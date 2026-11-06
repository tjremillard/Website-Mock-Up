import { notFound } from "next/navigation";
import Link from "next/link";
import { properties } from "@/data/air";
import { PropertyPanel } from "@/components/air/explore";
import { ViewEvent } from "@/components/air/editorial";
export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = properties.find((p) => p.id === id);
  if (!p) notFound();
  return (
    <main id="main-content" className="air-container air-section">
      <Link className="air-text-link" href={`/app?property=${p.id}`}>
        ← View on map
      </Link>
      <ViewEvent event="property_selected" id={p.id} />
      <h1 className="air-property-heading">Property intelligence</h1>
      <PropertyPanel property={p} />
    </main>
  );
}
