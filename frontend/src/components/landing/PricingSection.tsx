import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 gradient-radial opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-muted-foreground">Start free. Scale as you grow.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-6 flex flex-col transition-all ${
                plan.highlighted
                  ? "glass glow-primary border-primary/30 relative"
                  : "glass"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-xs text-primary mb-6">{plan.replies}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "gradient-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  } transition-all`}
                  size="sm"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
