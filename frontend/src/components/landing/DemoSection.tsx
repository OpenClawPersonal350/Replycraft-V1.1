import { motion } from "framer-motion";
import { Star, Bot, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Star,
    title: "Customer Leaves Review",
    description: "A customer posts a review on Google, Yelp, or any connected platform.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Bot,
    title: "AI Generates Reply",
    description: "ReplyCraft detects the review and crafts a contextual, professional response.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: CheckCircle2,
    title: "Business Approves",
    description: "Review the reply, edit if needed, and publish — or let it auto-send.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
];

export function DemoSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-muted-foreground">Three simple steps to automated review management.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass rounded-2xl p-8 mb-4"
              >
                <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="text-xs text-muted-foreground/60 mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
