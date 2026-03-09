import { motion } from "framer-motion";
import { Lock, ArrowRight, Star, CheckCircle2, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  planName: string;
  billing: string;
  currencySymbol: string;
  subtotal: number;
  discount: number;
  discountLabel: string;
  tax: number;
  taxLabel: string;
  total: number;
  period: string;
  features: string[];
  isPaying: boolean;
  canPay: boolean;
  onPay: () => void;
}

export const OrderSummary = ({
  planName,
  billing,
  currencySymbol,
  subtotal,
  discount,
  discountLabel,
  tax,
  taxLabel,
  total,
  period,
  features,
  isPaying,
  canPay,
  onPay,
}: OrderSummaryProps) => {
  return (
    <div className="glass rounded-2xl border border-border/60 overflow-hidden">
      {/* Header gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="p-6 md:p-8">
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Order Summary
        </h2>

        {/* Plan card */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 rounded-xl p-5 mb-5 border border-primary/15">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-foreground">{planName} Plan</h3>
              <Badge variant="secondary" className="mt-1.5 text-xs">
                {billing === "yearly" ? "Annual — Save 20%" : "Monthly"} billing
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {currencySymbol}{subtotal.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">/{period}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-5 space-y-2.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What's included</p>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Price breakdown */}
        <div className="space-y-2.5 py-4 border-t border-border/40">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">{currencySymbol}{subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-secondary font-medium">
                Discount {discountLabel && `(${discountLabel})`}
              </span>
              <span className="text-secondary font-medium">-{currencySymbol}{discount.toLocaleString()}</span>
            </div>
          )}

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{taxLabel || "Tax"}</span>
              <span className="text-foreground">+{currencySymbol}{tax.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t border-border/40">
          <span className="text-base font-bold text-foreground">Total</span>
          <div className="text-right">
            <span className="text-3xl font-bold text-foreground">
              {currencySymbol}{total.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground ml-1">/{period}</span>
          </div>
        </div>

        {/* Pay button */}
        <Button
          onClick={onPay}
          disabled={!canPay || isPaying}
          className="w-full gradient-primary text-primary-foreground btn-glow h-13 text-base gap-2 mt-3 rounded-xl font-semibold shadow-lg shadow-primary/20"
          size="lg"
        >
          {isPaying ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay {currencySymbol}{total.toLocaleString()}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        {/* Trust */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span className="text-[10px]">Secured with 256-bit encryption</span>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2 leading-relaxed">
          By proceeding, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground transition-colors">Terms</a> &{" "}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          Cancel anytime.
        </p>
      </div>
    </div>
  );
};
