import type { Metadata } from "next";
import "./globals.css";
import "./air.css";
export const metadata: Metadata = {
  title: "AIR | Alternative Infrastructure Realty",
  description:
    "Explore Massachusetts wireless infrastructure and property intelligence with Alternative Infrastructure Realty.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
