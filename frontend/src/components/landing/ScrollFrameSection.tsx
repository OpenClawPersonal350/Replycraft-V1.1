import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, BarChart3, Clock, Globe2, Cpu } from "lucide-react";

const frames = [
  {
    icon: Globe2,
    title: "Multi-Platform Monitoring",
    description: "Track reviews across Google, Yelp, TripAdvisor, Facebook, and 20+ platforms from one dashboard.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Cpu,
    title: "AI-Powered Responses",
    description: "GPT-4 powered engine crafts contextual, brand-aligned replies that feel genuinely human.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Clock,
    title: "Instant Response Time",
    description: "Replies generated within seconds of a new review. Never leave a customer waiting again.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Shield,
    title: "Brand Voice Protection",
    description: "Train the AI with your brand guidelines. Every reply matches your tone and values perfectly.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Sentiment Analytics",
    description: "Deep insights into customer sentiment trends, helping you improve before issues escalate.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Zap,
    title: "One-Click Automation",
    description: "Set rules for auto-publishing replies or route them for human approval. Full control, zero effort.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

function FrameCard({ frame, index }: { frame: typeof frames[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -100 : 100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ x, opacity, scale }}
      className={`flex items-center gap-4 lg:gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
    >
      <div className="w-full lg:flex-1 bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl ${frame.bg} flex items-center justify-center mb-4 lg:mb-6`}>
          <frame.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${frame.color}`} />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 lg:mb-3">{frame.title}</h3>
        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{frame.description}</p>
      </div>
      <div className="hidden lg:flex w-20 items-center justify-center">
        <div className="w-px h-full min-h-[100px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>
      <div className="flex-1 hidden lg:block" />
    </motion.div>
  );
}

export function ScrollFrameSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Everything you need to{" "}
            <span className="gradient-text">dominate</span> reviews
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete toolkit for reputation management, powered by cutting-edge AI.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12 lg:space-y-16">
          {frames.map((frame, i) => (
            <FrameCard key={frame.title} frame={frame} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
