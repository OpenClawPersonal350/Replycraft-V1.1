import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag, Lock, ArrowLeft, Shield, CheckCircle2,
  Globe, Sparkles, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AuthBackground } from "@/components/AuthBackground";
import { CountrySelector } from "@/components/payment/CountrySelector";
import { PaymentMethodCard } from "@/components/payment/PaymentMethodCard";
import { OrderSummary } from "@/components/payment/OrderSummary";
import {
  getMethodsForCountry,
  getCurrencyInfo,
  getTaxInfo,
  getPlanById,
} from "@/data/payment-config";
import {
  useValidateCoupon,
  useInitPayment,
} from "@/api/hooks";

const securityBadges = [
  { icon: Shield, label: "256-bit SSL" },
  { icon: Lock, label: "PCI DSS Compliant" },
  { icon: CheckCircle2, label: "30-Day Guarantee" },
];

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";

  // Country & region
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{
    valid: boolean;
    discountPercent: number;
    discountLabel: string;
    message: string;
  } | null>(null);

  const validateCoupon = useValidateCoupon();
  const initPayment = useInitPayment();

  // Derived data
  const availableMethods = useMemo(
    () => getMethodsForCountry(selectedCountry),
    [selectedCountry]
  );

  const plan = useMemo(() => getPlanById(planId), [planId]);
  const currencyInfo = useMemo(() => getCurrencyInfo(selectedCountry), [selectedCountry]);
  const taxInfo = useMemo(() => getTaxInfo(selectedCountry), [selectedCountry]);

  // Auto-select first method when country changes
  useMemo(() => {
    if (availableMethods.length > 0) {
      setSelectedMethod(availableMethods[0].id);
    }
  }, [availableMethods]);

  // Price calculations
  const computed = useMemo(() => {
    if (!plan) return { subtotal: 0, discount: 0, tax: 0, total: 0 };
    const baseUSD = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    const subtotal = Math.round(baseUSD * currencyInfo.rate);
    const couponDiscount = couponResult?.valid
      ? Math.round(subtotal * (couponResult.discountPercent / 100))
      : 0;
    const afterDiscount = subtotal - couponDiscount;
    const tax = Math.round(afterDiscount * (taxInfo.rate / 100));
    const total = afterDiscount + tax;
    return { subtotal, discount: couponDiscount, tax, total };
  }, [plan, billing, currencyInfo, taxInfo, couponResult]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim() || !planId) return;
    try {
      const result = await validateCoupon.mutateAsync({ code: couponCode, planId });
      setCouponResult(result);
    } catch {
      setCouponResult({
        valid: false,
        discountPercent: 0,
        discountLabel: "",
        message: "Invalid coupon code",
      });
    }
  }, [couponCode, planId, validateCoupon]);

  const handlePay = useCallback(async () => {
    if (!selectedMethod || !planId) return;
    try {
      const result = await initPayment.mutateAsync({
        planId,
        billing: billing as "monthly" | "yearly",
        paymentMethodId: selectedMethod,
        couponCode: couponResult?.valid ? couponCode : undefined,
      });
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch {
      // Error handled by mutation
    }
  }, [selectedMethod, planId, billing, couponResult, couponCode, initPayment]);

  const isIndia = selectedCountry === "IN";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-8">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/upgrade")}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl border border-border/60 overflow-hidden">
              {/* Header gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Lock className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Secure Checkout</h1>
                    <p className="text-sm text-muted-foreground">
                      Complete your purchase securely
                    </p>
                  </div>
                </div>

                {/* Country Selector */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    Your Country
                  </Label>
                  <div className="mt-2">
                    <CountrySelector
                      selectedCode={selectedCountry}
                      onSelect={setSelectedCountry}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Currency: {currencyInfo.symbol} ({currencyInfo.currency})
                    {taxInfo.rate > 0 && ` · ${taxInfo.label}`}
                  </p>
                </div>

                {/* Region indicator */}
                <div className="mb-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isIndia
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    <Zap className="w-3 h-3" />
                    {isIndia ? "Indian Payment Methods via Razorpay" : "International Payment Methods"}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold text-foreground mb-3 block">
                    Choose Payment Method
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                      {availableMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          layout
                        >
                          <PaymentMethodCard
                            method={method}
                            isSelected={selectedMethod === method.id}
                            onSelect={() => setSelectedMethod(method.id)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                  <Label className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Have a coupon code?
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponResult(null);
                      }}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground uppercase tracking-wider"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || validateCoupon.isPending}
                      className="shrink-0 min-w-[80px]"
                    >
                      {validateCoupon.isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      ) : couponResult?.valid ? (
                        <>
                          Applied <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {couponResult && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-xs mt-2 ${
                          couponResult.valid ? "text-secondary" : "text-destructive"
                        }`}
                      >
                        {couponResult.valid
                          ? `🎉 ${couponResult.message}`
                          : `❌ ${couponResult.message}`}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Security Badges */}
                <div className="flex flex-wrap items-center justify-center gap-5 pt-5 mt-6 border-t border-border/30">
                  {securityBadges.map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-1.5 text-muted-foreground"
                    >
                      <badge.icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-8">
              {plan ? (
                <OrderSummary
                  planName={plan.name}
                  billing={billing}
                  currencySymbol={currencyInfo.symbol}
                  subtotal={computed.subtotal}
                  discount={computed.discount}
                  discountLabel={couponResult?.valid ? couponResult.discountLabel : ""}
                  tax={computed.tax}
                  taxLabel={taxInfo.label}
                  total={computed.total}
                  period={billing === "yearly" ? "year" : "month"}
                  features={plan.features}
                  isPaying={initPayment.isPending}
                  canPay={!!selectedMethod}
                  onPay={handlePay}
                />
              ) : (
                <div className="glass rounded-2xl p-8 border border-border/60 text-center">
                  <p className="text-muted-foreground">
                    No plan selected. Please go back and choose a plan.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/upgrade")}
                    className="mt-4"
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
