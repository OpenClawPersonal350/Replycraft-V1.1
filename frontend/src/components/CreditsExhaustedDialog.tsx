import { motion } from "framer-motion";
import { AlertTriangle, Crown, Rocket, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  rocket: Rocket,
  crown: Crown,
  sparkles: Sparkles,
};

// ---- Mock tiers (replace with useUpgradePlans() hook) ----
const ALL_PLANS = [
  { id: "free", name: "Free", price: "$0", repliesPerDay: "5/day", icon: "zap", order: 0 },
  { id: "go", name: "Go", price: "$29", repliesPerDay: "200/day", icon: "rocket", order: 1 },
  { id: "pro", name: "Pro", price: "$79", repliesPerDay: "1,000/day", icon: "crown", order: 2 },
  { id: "ultra", name: "Ultra", price: "$199", repliesPerDay: "5,000/day", icon: "sparkles", order: 3 },
];

interface CreditsExhaustedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: string;
  message?: string;
}

export function CreditsExhaustedDialog({
  open,
  onOpenChange,
  currentPlan = "Free",
  message,
}: CreditsExhaustedDialogProps) {
  const navigate = useNavigate();

  // TODO: Replace with useUpgradePlans(currentPlanId) when backend is connected
  const upgradePlans = useMemo(() => {
    const currentOrder = ALL_PLANS.find((p) => p.name.toLowerCase() === currentPlan.toLowerCase())?.order ?? 0;
    return ALL_PLANS.filter((p) => p.order > currentOrder);
  }, [currentPlan]);

  const currentPlanData = ALL_PLANS.find((p) => p.name.toLowerCase() === currentPlan.toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass border-border p-0 overflow-hidden">
        {/* Top warning banner */}
        <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <DialogHeader className="p-0 space-y-0">
              <DialogTitle className="text-base text-foreground">Out of Credits</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                {message || `You've used all your daily replies on the ${currentPlan} plan.`}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Current plan info */}
        {currentPlanData && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/30">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                {(() => {
                  const Icon = iconMap[currentPlanData.icon] || Zap;
                  return <Icon className="w-4 h-4 text-muted-foreground" />;
                })()}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Your current plan</p>
                <p className="text-sm font-semibold text-foreground">{currentPlanData.name} — {currentPlanData.repliesPerDay} replies</p>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground border-border">Limit reached</Badge>
            </div>
          </div>
        )}

        {/* Upgrade plan options (only higher tiers) */}
        <div className="px-6 py-4 space-y-3">
          {upgradePlans.length > 0 ? (
            <>
              <p className="text-sm font-medium text-foreground mb-3">Upgrade to keep replying:</p>
              {upgradePlans.map((plan, i) => {
                const Icon = iconMap[plan.icon] || Zap;
                const isRecommended = i === 0; // first higher tier is recommended
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/40 ${
                      isRecommended ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
                    }`}
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/dashboard/upgrade");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isRecommended ? "gradient-primary" : "bg-muted"
                      }`}>
                        <Icon className={`w-4 h-4 ${isRecommended ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{plan.name}</span>
                          {isRecommended && (
                            <span className="text-[10px] gradient-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{plan.repliesPerDay} replies</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {plan.price}<span className="text-muted-foreground font-normal">/mo</span>
                    </span>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              You're on the highest plan. Contact support for custom limits.
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-5 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Button
            className="flex-1 gradient-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
            onClick={() => {
              onOpenChange(false);
              navigate("/dashboard/upgrade");
            }}
          >
            View All Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
