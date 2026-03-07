import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, Crown, Rocket, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const upgradePlans = [
  { name: "Go", price: "$29", replies: "200/day", icon: Rocket, color: "text-accent" },
  { name: "Pro", price: "$79", replies: "1,000/day", icon: Crown, color: "text-primary", highlighted: true },
  { name: "Ultra", price: "$199", replies: "5,000/day", icon: Zap, color: "text-secondary" },
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

        {/* Plan options */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm font-medium text-foreground mb-3">Upgrade to keep replying:</p>

          {upgradePlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/40 ${
                plan.highlighted
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/20"
              }`}
              onClick={() => {
                onOpenChange(false);
                navigate("/dashboard/upgrade");
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  plan.highlighted ? "gradient-primary" : "bg-muted"
                }`}>
                  <plan.icon className={`w-4 h-4 ${plan.highlighted ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{plan.name}</span>
                    {plan.highlighted && (
                      <span className="text-[10px] gradient-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{plan.replies} replies</span>
                </div>
              </div>
              <span className="text-sm font-bold text-foreground">{plan.price}<span className="text-muted-foreground font-normal">/mo</span></span>
            </motion.div>
          ))}
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
