import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const plans = [
  { name: "Free", price: "$0/mo", replies: "5/day", current: false },
  { name: "Go", price: "$29/mo", replies: "200/day", current: false },
  { name: "Pro", price: "$79/mo", replies: "1,000/day", current: true },
  { name: "Ultra", price: "$199/mo", replies: "5,000/day", current: false },
];

const Billing = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription plan.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-foreground">Current Plan</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">Pro</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">$79/month · 1,000 replies/day</p>
        <p className="text-xs text-muted-foreground">Next billing date: April 6, 2026</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`glass rounded-xl p-5 text-center ${plan.current ? "glow-primary border-primary/30" : ""}`}
          >
            <h4 className="font-semibold text-foreground mb-1">{plan.name}</h4>
            <p className="text-xl font-bold text-foreground mb-1">{plan.price}</p>
            <p className="text-xs text-muted-foreground mb-4">{plan.replies} replies</p>
            {plan.current ? (
              <Button size="sm" className="w-full bg-muted text-muted-foreground cursor-default" disabled>
                Current
              </Button>
            ) : (
              <Link to="/dashboard/upgrade">
                <Button size="sm" className="w-full gradient-primary text-primary-foreground hover:opacity-90">
                  Upgrade
                </Button>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
