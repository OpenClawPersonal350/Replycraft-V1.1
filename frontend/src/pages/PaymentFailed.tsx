import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RotateCcw, HeadphonesIcon, ArrowLeft, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBackground } from "@/components/AuthBackground";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get("plan") || "Pro";
  const reason = searchParams.get("reason") || "Your payment could not be processed. Please try again or use a different payment method.";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl border border-border/60 overflow-hidden"
        >
          {/* Red gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-destructive to-destructive/60" />

          <div className="p-8 md:p-10 text-center">
            {/* Animated X icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
              >
                <XCircle className="w-10 h-10 text-destructive" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              Payment Failed
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto"
            >
              {reason}
            </motion.p>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 mb-8 text-left"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    {plan} Plan — Payment Unsuccessful
                  </p>
                  <p className="text-muted-foreground text-xs">
                    No charges were made to your account. Common reasons include insufficient funds, card declined, or network issues.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() => navigate(-1)}
              >
                <RotateCcw className="w-4 h-4" />
                Retry Payment
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2"
                onClick={() => navigate("/contact")}
              >
                <HeadphonesIcon className="w-4 h-4" />
                Contact Support
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </motion.div>

            {/* Support email */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              Need help? Email us at{" "}
              <a href="mailto:support@reviewflow.com" className="text-primary hover:underline">
                support@reviewflow.com
              </a>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailed;
