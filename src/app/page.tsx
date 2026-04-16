import BubbleBackground from "@/components/BubbleBackground";
import CursorGlow from "@/components/CursorGlow";
import HeroSection from "@/components/HeroSection";
import ChatBar from "@/components/ChatBar";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 10%, rgba(167,139,250,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(96,165,250,0.1) 0%, transparent 50%), #f8f9fc",
      }}
    >
      <BubbleBackground />
      <CursorGlow />
      <HeroSection />
      <ChatBar />
    </main>
  );
}
