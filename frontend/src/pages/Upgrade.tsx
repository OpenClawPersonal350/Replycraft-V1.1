import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowLeft, Crown, Zap, Rocket, Building2, CreditCard, Tag, Lock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "Free",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with basics",
    replies: "5 replies/day",
    features: ["1 platform", "Basic AI replies", "Community support"],
    highlighted: false,
    badge: null,
  },
  {
    name: "Go",
    icon: Rocket,
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For growing businesses",
    replies: "200 replies/day",
    features: ["3 platforms", "Smart tone detection", "Priority email support", "Basic analytics", "Custom reply templates"],
    highlighted: false,
    badge: null,
  },
  {
    name: "Pro",
    icon: Crown,
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "For serious businesses",
    replies: "1,000 replies/day",
    features: ["All platforms", "Custom brand tone", "Advanced analytics", "API access", "Team members (up to 5)", "Priority support", "Webhook integrations"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Ultra",
    icon: Building2,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    description: "Enterprise scale",
    replies: "5,000 replies/day",
    features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "White label", "Unlimited team members", "Custom AI training", "SOC2 compliance"],
    highlighted: false,
    badge: "Enterprise",
  },
];

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: null },
];

const Upgrade = () => {
  const [yearly, setYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const plan = plans.find((p) => p.name === selectedPlan);

  const handleApplyCoupon = () => {
    if (coupon.trim().length > 0) {
      setCouponApplied(true);
    }
  };

  const getDiscountedPrice = (price: number) => {
    if (couponApplied) return Math.round(price * 0.8);
    return price;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard/billing">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Upgrade Your Plan</h1>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {plans.map((p, i) => {
            const price = yearly ? p.yearlyPrice : p.monthlyPrice;
            const period = yearly ? "/year" : "/month";
            const PlanIcon = p.icon;
            const isSelected = selectedPlan === p.name;

            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => p.monthlyPrice > 0 && setSelectedPlan(p.name)}
                className={`rounded-2xl p-6 flex flex-col transition-all border cursor-pointer ${
                  isSelected
                    ? "glass glow-primary border-primary/50 ring-2 ring-primary/30"
                    : p.highlighted
                    ? "glass glow-primary border-primary/30 relative scale-[1.02]"
                    : "glass border-border hover:border-border/80"
                }`}
              >
                {p.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full ${
                    p.highlighted
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}>
                    {p.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    p.highlighted || isSelected ? "gradient-primary" : "bg-muted"
                  }`}>
                    <PlanIcon className={`w-5 h-5 ${p.highlighted || isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </div>

                <div className="mb-1">
                  <span className="text-4xl font-bold text-foreground">${price}</span>
                  <span className="text-muted-foreground text-sm">{period}</span>
                </div>
                <p className="text-xs text-primary font-medium mb-6">{p.replies}</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isSelected
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : p.highlighted
                      ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  } transition-all`}
                >
                  {p.monthlyPrice === 0 ? "Current Plan" : isSelected ? "Selected" : "Select Plan"}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Checkout Section */}
        <AnimatePresence>
          {selectedPlan && plan && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass rounded-2xl p-8 border border-border glow-primary">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Complete Your Upgrade</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedPlan(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-foreground font-medium">{plan.name} Plan — {yearly ? "Yearly" : "Monthly"}</span>
                    <span className="text-sm text-foreground font-bold">
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between items-center text-secondary text-sm">
                      <span>Coupon discount (20%)</span>
                      <span>-${Math.round((yearly ? plan.yearlyPrice : plan.monthlyPrice) * 0.2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">
                      ${getDiscountedPrice(yearly ? plan.yearlyPrice : plan.monthlyPrice)}
                      <span className="text-xs text-muted-foreground ml-1">{yearly ? "/year" : "/month"}</span>
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <Label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Coupon Code
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
                      className="bg-muted/30 border-border"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!coupon.trim() || couponApplied}
                      className="shrink-0"
                    >
                      {couponApplied ? "Applied ✓" : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-secondary mt-1">🎉 Coupon applied! 20% discount activated.</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <Label className="text-sm text-muted-foreground mb-2 block">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                          paymentMethod === pm.id
                            ? "border-primary/50 bg-primary/5 text-foreground"
                            : "border-border bg-muted/20 text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {pm.icon ? <pm.icon className="w-4 h-4" /> : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.44a.8.8 0 0 0-.79.68l-.04.22-.63 3.993-.03.17a.8.8 0 0 1-.79.68H8.72a.43.43 0 0 1-.43-.51l.58-3.72.04-.23a.8.8 0 0 1 .79-.68h.5c3.226 0 5.75-1.31 6.49-5.1.31-1.58.15-2.9-.67-3.83a3.56 3.56 0 0 0-1.02-.78c.43-.28.78-.62 1.07-1.05z"/>
                            <path d="M18.33 7.33a7.77 7.77 0 0 0-.95-.35 12.52 12.52 0 0 0-1.95-.22h-5.9a.8.8 0 0 0-.79.68L7.42 15.4l-.03.17a.8.8 0 0 1 .79-.68h1.64c3.84 0 6.85-1.56 7.73-6.07.03-.13.05-.26.07-.38a4.36 4.36 0 0 0-.67-.41l-.02-.01c.16-.47.27-.95.33-1.44l.07-.26z"/>
                          </svg>
                        )}
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">Card Number</Label>
                      <Input placeholder="4242 4242 4242 4242" className="bg-muted/30 border-border mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Expiry</Label>
                        <Input placeholder="MM / YY" className="bg-muted/30 border-border mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">CVC</Label>
                        <Input placeholder="123" className="bg-muted/30 border-border mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full gradient-primary text-primary-foreground btn-glow h-12 text-base gap-2">
                  <Lock className="w-4 h-4" />
                  Pay ${getDiscountedPrice(yearly ? plan.yearlyPrice : plan.monthlyPrice)}{yearly ? "/year" : "/month"}
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption · 30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guarantee */}
        {!selectedPlan && (
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
        )}
      </div>
    </div>
  );
};

export default Upgrade;
