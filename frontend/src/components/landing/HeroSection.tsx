import { motion } from "framer-motion";
import { ArrowRight, Star, MessageSquare, ThumbsUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const heroFeedItems = [
  { type: "review" as const, text: "Amazing food and great service! Will definitely come back.", name: "Sarah M.", platform: "Google", rating: 5 },
  { type: "ai" as const, text: "Thank you Sarah! We're thrilled you enjoyed your experience. We look forward to welcoming you again!" },
  { type: "published" as const },
  { type: "review" as const, text: "Best customer service I've experienced anywhere.", name: "James K.", platform: "Yelp", rating: 5 },
  { type: "ai" as const, text: "James, your kind words mean the world to us! Exceptional service is always our goal." },
  { type: "published" as const },
  { type: "review" as const, text: "Absolutely loved every moment. The staff was incredible!", name: "Aisha R.", platform: "TripAdvisor", rating: 5 },
  { type: "ai" as const, text: "Aisha, thank you so much! It was our pleasure to make your visit special." },
  { type: "published" as const },
  { type: "review" as const, text: "Perfect dining experience from start to finish.", name: "Mei L.", platform: "Google", rating: 5 },
  { type: "ai" as const, text: "Mei, we appreciate your wonderful review! We strive for excellence every day." },
  { type: "published" as const },
];

function HeroFeedItem({ item }: { item: typeof heroFeedItems[0] }) {
  if (item.type === "review") {
    return (
      <div className="flex justify-end">
        <div className="border border-border/20 rounded-2xl p-5 max-w-[280px]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">"{item.text}"</p>
              <p className="text-xs text-muted-foreground/50 mt-1.5">— {item.name} on {item.platform}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (item.type === "ai") {
    return (
      <div className="flex justify-start">
        <div className="border border-border/20 rounded-2xl p-5 max-w-[300px]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-foreground">AI Reply Generated</p>
                <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full font-medium">Auto</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">"{item.text}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="border border-border/20 rounded-2xl p-5 max-w-[240px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Reply Published</p>
            <p className="text-xs text-secondary">Sent automatically ✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroAutoScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const loopHeightRef = useRef(0);
  const loopItems = [...heroFeedItems, ...heroFeedItems];

  useEffect(() => {
    const syncLoopHeight = () => {
      const track = trackRef.current;
      if (!track) return;
      loopHeightRef.current = track.scrollHeight / 2;
      if (loopHeightRef.current > 0) {
        offsetRef.current = offsetRef.current % loopHeightRef.current;
        track.style.transform = `translateY(-${offsetRef.current}px)`;
      }
    };

    syncLoopHeight();

    const resizeObserver = new ResizeObserver(syncLoopHeight);
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    const animate = (now: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const track = trackRef.current;
      const loopHeight = loopHeightRef.current;

      if (track && loopHeight > 0) {
        let next = offsetRef.current + delta * 0.025;
        if (next >= loopHeight) {
          next -= loopHeight;
        }
        offsetRef.current = next;
        track.style.transform = `translateY(-${next}px)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      lastTimeRef.current = 0;
    };
  }, []);

  return (
    <div className="h-full overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
      <div ref={trackRef} className="space-y-4 will-change-transform">
        {loopItems.map((item, i) => (
          <HeroFeedItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-8">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, hsl(var(--primary) / 0.08) 0deg, transparent 60deg, hsl(var(--accent) / 0.06) 120deg, transparent 180deg, hsl(var(--secondary) / 0.06) 240deg, transparent 300deg, hsl(var(--primary) / 0.08) 360deg)"
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Left */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Trusted by 2,000+ businesses worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
              Automate Customer
              <br />
              Review Replies{" "}
              <span className="gradient-text">with AI</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              ReplyCraft detects new reviews across platforms and generates professional, on-brand replies instantly using AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 transition-all gap-2 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Floating cards */}
          <div className="absolute -top-16 bottom-0 right-0 w-1/2 hidden lg:block">
            <div className="relative h-full">
              <HeroAutoScroll />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
