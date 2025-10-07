import Header from "./components/home/Header";
import EarlyAccessSection from "./components/home/EarlyAccessSection";
import HeroSection from "./components/home/HeroSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <EarlyAccessSection />
      </main>
    </>
  );
}
