import { motion } from "framer-motion";
import { Bot, Globe, Brain, Zap, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Generated Replies", description: "Craft professional, context-aware responses to every review automatically.", color: "primary" },
  { icon: Globe, title: "Multi-Platform Detection", description: "Monitor Google, Yelp, TripAdvisor, App Store, and Play Store in one place.", color: "accent" },
  { icon: Brain, title: "Smart Tone Detection", description: "AI adapts reply tone based on sentiment — grateful, empathetic, or professional.", color: "secondary" },
  { icon: Zap, title: "Automatic Replies", description: "Set it and forget it. Auto-publish replies or queue for your approval.", color: "primary" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track sentiment trends, reply rates, and review volume across all platforms.", color: "accent" },
  { icon: ShieldCheck, title: "Manual Approval Mode", description: "Review and edit AI-generated replies before they go live.", color: "secondary" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Everything you need to <br className="hidden sm:block" /><span className="gradient-text">manage reviews</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From detection to response, ReplyCraft handles your entire review management workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            // Animate by row: cards in the same row share the same delay
            const rowIndex = Math.floor(i / 3);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: rowIndex * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative bg-card/50 backdrop-blur-xl border border-border/40 rounded-2xl p-7 cursor-default transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-base">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
