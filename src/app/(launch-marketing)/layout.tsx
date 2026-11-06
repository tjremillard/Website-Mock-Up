import { Header } from "@/components/air/header";
import { Footer } from "@/components/air/brand";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="air">
      <a className="air-skip" href="#main-content">
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
