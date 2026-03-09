import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { AuthBackground } from "@/components/AuthBackground";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    repliesPerDay: "5 replies/day",
    features: ["5 AI replies per day", "1 platform", "Basic analytics", "Email support"],
    popular: false,
  },
  {
    id: "go",
    name: "Go",
    price: "$29",
    period: "/mo",
    repliesPerDay: "200 replies/day",
    features: ["200 AI replies per day", "3 platforms", "Advanced analytics", "Priority support"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/mo",
    repliesPerDay: "1,000 replies/day",
    features: ["1,000 AI replies per day", "Unlimited platforms", "Custom tone", "API access", "Dedicated support"],
    popular: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$199",
    period: "/mo",
    repliesPerDay: "5,000 replies/day",
    features: ["5,000 AI replies per day", "Unlimited platforms", "White-label", "SLA guarantee", "Account manager"],
    popular: false,
  },
];

const PlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = () => {
    setIsLoading(true);
    // TODO: Call profileApi.completeOnboarding + billingApi.changePlan
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Welcome aboard! 🎉", description: `You're on the ${plans.find((p) => p.id === selectedPlan)?.name} plan.` });
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-8">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="text-center mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Step 2 of 2</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">Choose your plan</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">You can always change this later</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass rounded-xl p-5 cursor-pointer transition-all relative ${
                selectedPlan === plan.id
                  ? "border-primary ring-2 ring-primary/20 glow-primary"
                  : "hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> POPULAR
                  </span>
                </div>
              )}

              <div className="mb-3">
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.repliesPerDay}</p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {selectedPlan === plan.id && (
                <motion.div
                  layoutId="plan-check"
                  className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 h-11 px-12"
          >
            {isLoading ? "Setting up..." : (
              <>
                {selectedPlan === "free" ? "Continue with Free" : "Start free trial"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanSelection;
