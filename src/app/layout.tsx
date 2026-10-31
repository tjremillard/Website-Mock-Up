import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Easement | Real Estate",
  description:
    "Explore property infrastructure opportunities, manage leases, and review property services. Easement Real Estate / WRA prototype.",
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
