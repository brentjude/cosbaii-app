import Header from "./components/home/Header";
import EarlyAccessSection from "./components/home/EarlyAccessSection";
import HeroSection from "./components/home/HeroSection";
import AboutCosbaii from "./components/home/AboutCosbaii";
import CosplayJourney from "./components/home/CosplayJourney";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutCosbaii />
        <CosplayJourney />
        <EarlyAccessSection />
      </main>
    </>
  );
}
