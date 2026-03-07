import { motion } from "framer-motion";
import { Bot, Globe, Brain, Zap, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Generated Replies", description: "Craft professional, context-aware responses to every review automatically." },
  { icon: Globe, title: "Multi-Platform Detection", description: "Monitor Google, Yelp, TripAdvisor, App Store, and Play Store in one place." },
  { icon: Brain, title: "Smart Tone Detection", description: "AI adapts reply tone based on sentiment — grateful, empathetic, or professional." },
  { icon: Zap, title: "Automatic Replies", description: "Set it and forget it. Auto-publish replies or queue for your approval." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track sentiment trends, reply rates, and review volume across all platforms." },
  { icon: ShieldCheck, title: "Manual Approval Mode", description: "Review and edit AI-generated replies before they go live." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 gradient-radial opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to <span className="gradient-text">manage reviews</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From detection to response, ReplyCraft handles your entire review management workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-6 group cursor-default transition-all hover:glow-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
