import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { validVisionSession, visionCookie } from "@/lib/air/vision-auth";
import { Header } from "@/components/air/header";
export const metadata = {
  title: "AIR | Internal Vision Prototype",
  robots: { index: false, follow: false },
};
async function Authorized({ children }: { children: React.ReactNode }) {
  // Expiry must be checked at request time, never during partial prefetch.
  await connection();
  if (!validVisionSession((await cookies()).get(visionCookie)?.value))
    redirect("/vision-access");
  return (
    <>
      <Header vision />
      <div className="air-demo-notice">
        Internal Vision Prototype · Illustrative demo · Future capabilities are
        not launch offerings
      </div>
      {children}
    </>
  );
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="air">
      <Suspense
        fallback={
          <div className="air-map-loading">Checking internal access…</div>
        }
      >
        <Authorized>{children}</Authorized>
      </Suspense>
    </div>
  );
}
