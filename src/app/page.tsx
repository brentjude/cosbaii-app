import Header from "./components/home/Header";
import EarlyAccessSection from "./components/home/EarlyAccessSection";
import HeroSection from "./components/home/HeroSection";
import AboutCosbaii from "./components/home/AboutCosbaii";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutCosbaii />
        <EarlyAccessSection />
      </main>
    </>
  );
}
