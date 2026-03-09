import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { Star, Bot, MessageSquare, ThumbsUp, Sparkles } from "lucide-react";
import { Globe3D } from "./Globe3D";

const feedItems = [
  { type: "review" as const, name: "Sarah M.", location: "New York", platform: "Google", text: "Amazing food and great service! Will definitely come back.", rating: 5 },
  { type: "ai" as const, text: "Thank you Sarah! We're thrilled you enjoyed your experience. We look forward to welcoming you again!" },
  { type: "published" as const, text: "Reply Published" },
  { type: "review" as const, name: "James K.", location: "London", platform: "Yelp", text: "Best customer service I've experienced. Highly recommend!", rating: 5 },
  { type: "ai" as const, text: "James, your kind words mean the world to us! Exceptional service is our top priority." },
  { type: "published" as const, text: "Reply Published" },
  { type: "review" as const, name: "Aisha R.", location: "Dubai", platform: "TripAdvisor", text: "Absolutely loved the experience! The staff was wonderful.", rating: 5 },
  { type: "ai" as const, text: "Aisha, thank you so much! It was our pleasure to make your visit special. See you soon!" },
  { type: "published" as const, text: "Reply Published" },
  { type: "review" as const, name: "Carlos P.", location: "São Paulo", platform: "Google", text: "Incredible atmosphere and delicious menu. A must-visit!", rating: 5 },
  { type: "ai" as const, text: "Carlos, we appreciate your wonderful review! We're glad the atmosphere resonated with you." },
  { type: "published" as const, text: "Reply Published" },
  { type: "review" as const, name: "Mei L.", location: "Tokyo", platform: "TripAdvisor", text: "Perfect dining experience from start to finish.", rating: 5 },
  { type: "ai" as const, text: "Mei, thank you for the perfect rating! We strive for excellence and your feedback inspires us." },
  { type: "published" as const, text: "Reply Published" },
];

function ReviewBubble({ item }: { item: typeof feedItems[0] }) {
  if (item.type === "review") {
    return (
      <div className="flex justify-end">
        <div className="border border-border/20 rounded-2xl p-4 max-w-[320px]">
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <div className="flex gap-0.5">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-2">"{item.text}"</p>
          <p className="text-xs text-muted-foreground">— {item.name} on {item.platform}</p>
        </div>
      </div>
    );
  }

  if (item.type === "ai") {
    return (
      <div className="flex justify-start">
        <div className="border border-primary/10 rounded-2xl p-4 max-w-[320px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Reply Generated</span>
            <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Auto</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">"{item.text}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 flex items-center gap-2">
        <ThumbsUp className="w-4 h-4 text-green-500" />
        <div>
          <span className="text-sm font-semibold text-foreground">{item.text}</span>
          <p className="text-xs text-green-600 dark:text-green-400">Sent automatically ✓</p>
        </div>
      </div>
    </div>
  );
}

function AutoScrollFeed() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const loopHeightRef = useRef(0);

  const loopItems = [...feedItems, ...feedItems];

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
        let next = offsetRef.current + delta * 0.03;
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
    <div className="h-[500px] overflow-hidden relative">
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div ref={trackRef} className="space-y-4 transition-none will-change-transform">
        {loopItems.map((item, i) => (
          <ReviewBubble key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export function GlobeReviewFlow() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
            Global Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Reviews from <span className="gradient-text">everywhere</span>,
            <br />
            replies in <span className="gradient-text">seconds</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI monitors reviews across every platform worldwide and crafts perfect responses instantly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Globe */}
          <div className="h-[280px] sm:h-[400px] lg:h-[500px] relative mx-auto max-w-[90vw] sm:max-w-none">
            <Globe3D />
            {/* Glow under globe */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[60px] bg-primary/10 blur-[40px] rounded-full" />
          </div>

          {/* Auto-scrolling Review Feed */}
          <AutoScrollFeed />
        </div>
      </div>
    </section>
  );
}
