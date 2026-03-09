import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowLeft, Crown, Zap, Rocket, Building2, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import { useBillingInfo } from "@/api/hooks";
import { PageSkeleton } from "@/components/dashboard/DashboardSkeleton";

const iconComponents: Record<string, React.ElementType> = {
  zap: Zap,
  rocket: Rocket,
  crown: Crown,
  sparkles: Building2,
};

const Upgrade = () => {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: billingInfo, isLoading } = useBillingInfo();

  const currentPlanName = billingInfo?.currentPlan?.name || user.plan;
  const plans = billingInfo?.allPlans ?? [];

  const currentPlanOrder = useMemo(() => {
    const found = plans.find((p) => p.name.toLowerCase() === currentPlanName.toLowerCase());
    return found?.order ?? 0;
  }, [currentPlanName, plans]);

  const getButtonState = (planOrder: number) => {
    if (planOrder === currentPlanOrder) return "current";
    if (planOrder < currentPlanOrder) return "downgrade";
    return "upgrade";
  };

  const handleSelectPlan = (planName: string, state: string) => {
    if (state === "current") return;
    navigate(`/payment?plan=${planName}&billing=${yearly ? "yearly" : "monthly"}&action=${state}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:sm:px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard/billing">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Upgrade Your Plan</h1>
            <p className="text-muted-foreground text-sm mt-1">Choose the perfect plan for your business needs</p>
          </div>
        </div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <Label className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</Label>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <Label className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>Yearly</Label>
          {yearly && (
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">Save 17%</Badge>
          )}
        </motion.div>

        {/* Plans grid */}
        {plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No plans available. Please try again later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {plans.map((p, i) => {
              const PlanIcon = iconComponents[p.icon] || Zap;
              const btnState = getButtonState(p.order);
              const isCurrent = btnState === "current";

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`rounded-2xl p-6 flex flex-col transition-all border relative ${
                    isCurrent
                      ? "glass ring-2 ring-primary/40 border-primary/30 shadow-lg shadow-primary/10"
                      : p.popular
                        ? "glass glow-primary border-primary/30"
                        : "glass border-border hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2 absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {isCurrent && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                        Current Plan
                      </span>
                    )}
                    {p.popular && !isCurrent && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full gradient-primary text-primary-foreground shadow-sm">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCurrent || p.popular ? "gradient-primary" : "bg-muted"
                    }`}>
                      <PlanIcon className={`w-5 h-5 ${isCurrent || p.popular ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.repliesPerDay} replies</p>
                    </div>
                  </div>

                  <div className="mb-1">
                    <span className="text-4xl font-bold text-foreground">{p.price}</span>
                    <span className="text-muted-foreground text-sm">{p.period}</span>
                  </div>
                  <p className="text-xs text-primary font-medium mb-6">{p.repliesPerDay} replies</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(p.name, btnState)}
                    disabled={isCurrent}
                    className={`w-full transition-all ${
                      isCurrent
                        ? "border-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/5 cursor-default"
                        : btnState === "upgrade"
                          ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    variant={isCurrent ? "outline" : "default"}
                  >
                    {isCurrent ? "Current Plan" : btnState === "upgrade" ? "Upgrade" : (
                      <span className="flex items-center gap-1.5">
                        <ArrowDown className="w-3.5 h-3.5" /> Downgrade
                      </span>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto border border-border">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">30-Day Money-Back Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Try any plan risk-free. If you're not satisfied within 30 days, we'll refund your payment — no questions asked.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upgrade;
