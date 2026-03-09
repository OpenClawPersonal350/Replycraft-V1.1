import { motion } from "framer-motion";
import { Star, Bot, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Star,
    title: "Customer Leaves Review",
    description: "A customer posts a review on Google, Yelp, or any connected platform.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    num: "01",
  },
  {
    icon: Bot,
    title: "AI Generates Reply",
    description: "ReplyCraft detects the review and crafts a contextual, professional response.",
    color: "text-primary",
    bg: "bg-primary/10",
    num: "02",
  },
  {
    icon: CheckCircle2,
    title: "Business Approves",
    description: "Review the reply, edit if needed, and publish — or let it auto-send.",
    color: "text-secondary",
    bg: "bg-secondary/10",
    num: "03",
  },
];

export function DemoSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">How it works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Three simple <span className="gradient-text">steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">From review to response in seconds.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
          {/* Connector lines */}
          <div className="hidden md:block absolute top-1/2 left-[33%] right-[33%] h-px bg-gradient-to-r from-border via-primary/20 to-border -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative z-10"
            >
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="text-xs font-bold text-primary/40 mb-4 tracking-widest">{step.num}</div>
                <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mx-auto mb-5`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
