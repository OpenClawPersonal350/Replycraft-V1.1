import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with basics",
    replies: "5 replies/day",
    features: ["1 platform", "Basic AI replies", "Email support"],
    highlighted: false,
  },
  {
    name: "Go",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    replies: "200 replies/day",
    features: ["3 platforms", "Smart tone detection", "Priority support", "Analytics"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For serious businesses",
    replies: "1,000 replies/day",
    features: ["All platforms", "Custom brand tone", "Advanced analytics", "API access", "Team members"],
    highlighted: true,
  },
  {
    name: "Ultra",
    price: "$199",
    period: "/month",
    description: "Enterprise scale",
    replies: "5,000 replies/day",
    features: ["Everything in Pro", "Dedicated support", "Custom integrations", "SLA guarantee", "White label"],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg">Start free. Scale as you grow. No hidden fees.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "bg-card/80 backdrop-blur-2xl border-2 border-primary/30 shadow-2xl shadow-primary/10 relative scale-[1.02]"
                  : "bg-card/50 backdrop-blur-xl border border-border/40 hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/20">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-xs font-medium text-primary mb-6">{plan.replies}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-secondary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard/upgrade">
                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.highlighted
                      ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                      : "bg-muted/50 text-foreground hover:bg-muted border border-border/40"
                  }`}
                  size="sm"
                >
                  {plan.highlighted ? "Get Started" : "Choose Plan"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
