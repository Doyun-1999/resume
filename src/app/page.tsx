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
          "radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.08) 0%, transparent 60%), #05050f",
      }}
    >
      {/* Animated bubble background */}
      <BubbleBackground />

      {/* Custom cursor + trail */}
      <CursorGlow />

      {/* Main content */}
      <HeroSection />

      {/* AI Chat bar at bottom */}
      <ChatBar />
    </main>
  );
}
