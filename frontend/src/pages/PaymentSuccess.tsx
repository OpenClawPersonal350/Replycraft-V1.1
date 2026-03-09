import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Download, Sparkles, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBackground } from "@/components/AuthBackground";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan") || "Pro";
  const amount = searchParams.get("amount") || "79";
  const currency = searchParams.get("currency") || "$";
  const billing = searchParams.get("billing") || "monthly";
  const orderId = searchParams.get("orderId") || "ORD-" + Date.now().toString(36).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass rounded-3xl border border-border/60 overflow-hidden"
        >
          {/* Gradient bar */}
          <div className="h-2 bg-gradient-to-r from-secondary via-primary to-accent" />

          <div className="p-8 md:p-10 text-center">
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </motion.div>
            </motion.div>

            {/* Confetti sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
                  y: [0, -(20 + i * 10)],
                }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1.2 }}
                className="absolute top-1/4"
                style={{ left: `${40 + i * 5}%` }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome to the <span className="text-primary font-semibold">{plan}</span> plan
              </p>
            </motion.div>

            {/* Order details card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 bg-muted/20 rounded-xl border border-border/40 p-5 text-left space-y-3"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-mono text-xs">{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-foreground font-semibold">{plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing</span>
                <span className="text-foreground capitalize">{billing}</span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between">
                <span className="text-foreground font-semibold">Amount Paid</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}{amount}
                </span>
              </div>
            </motion.div>

            {/* Email notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-2 mt-5 text-xs text-muted-foreground"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>A confirmation email has been sent to your inbox</span>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-8 space-y-3"
            >
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full gradient-primary text-primary-foreground btn-glow h-12 text-base gap-2 rounded-xl font-semibold"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/billing")}
                className="w-full h-10 gap-2 rounded-xl text-sm"
              >
                <Download className="w-4 h-4" />
                View Invoice
              </Button>
            </motion.div>

            {/* Security footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-1.5 mt-6 text-muted-foreground/60"
            >
              <Shield className="w-3 h-3" />
              <span className="text-[10px]">Transaction secured with 256-bit encryption</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
