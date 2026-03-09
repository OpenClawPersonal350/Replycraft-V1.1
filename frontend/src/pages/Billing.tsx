import { motion } from "framer-motion";
import { Check, Crown, Zap, Rocket, Sparkles, CreditCard, Calendar, ArrowRight, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import { useMemo } from "react";
import { useBillingInfo } from "@/api/hooks";
import { PageSkeleton } from "@/components/dashboard/DashboardSkeleton";

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  rocket: Rocket,
  crown: Crown,
  sparkles: Sparkles,
};

const Billing = () => {
  const { user } = useUser();
  const { data: billingInfo, isLoading, error } = useBillingInfo();

  const currentPlanOrder = useMemo(() => {
    return billingInfo?.currentPlan?.order ?? 0;
  }, [billingInfo]);

  if (isLoading) return <PageSkeleton />;

  if (error || !billingInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Unable to load billing</h2>
        <p className="text-sm text-muted-foreground">{error?.message || "Please try again later."}</p>
      </div>
    );
  }

  const { currentPlan, allPlans, nextBillingDate, usage, invoices } = billingInfo;
  const currentPlanName = currentPlan.name;
  const plans = allPlans;

  const getButtonState = (planOrder: number) => {
    if (planOrder === currentPlanOrder) return "current";
    if (planOrder < currentPlanOrder) return "downgrade";
    return "upgrade";
  };

  const handleDownloadInvoice = (invoiceId: string, downloadUrl: string) => {
    if (downloadUrl && downloadUrl !== "#") {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${invoiceId}.pdf`;
      a.click();
    }
  };

  const repliesPercent = usage.aiRepliesLimit > 0 ? (usage.aiRepliesUsed / usage.aiRepliesLimit) * 100 : 0;
  const storagePercent = (usage.storageUsedGb / usage.storageLimitGb) * 100;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your plan, usage, and payment details.</p>
      </div>

      {/* Current Plan + Usage Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 relative overflow-hidden ring-2 ring-primary/30 shadow-lg shadow-primary/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <Crown className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Plan</p>
                  <h3 className="text-lg font-bold text-foreground">{currentPlanName}</h3>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">Active</Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4" />
                <span>{currentPlan.price}{currentPlan.period}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Next billing: {nextBillingDate}</span>
              </div>
            </div>

            <Link to="/dashboard/upgrade">
              <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-muted/50">
                Change Plan <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">Usage This Period</h3>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">AI Replies</span>
                <span className="text-sm font-semibold text-foreground">
                  {usage.aiRepliesUsed.toLocaleString()} / {usage.aiRepliesLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={repliesPercent} className="h-2.5 rounded-full" />
              <p className="text-xs text-muted-foreground mt-1.5">
                {(usage.aiRepliesLimit - usage.aiRepliesUsed).toLocaleString()} replies remaining today
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Platforms Connected</span>
                <span className="text-sm font-semibold text-foreground">
                  {usage.platformsConnected} / {usage.platformsLimit === null ? "∞" : usage.platformsLimit}
                </span>
              </div>
              <Progress
                value={usage.platformsLimit === null ? Math.min(usage.platformsConnected * 10, 100) : (usage.platformsConnected / usage.platformsLimit) * 100}
                className="h-2.5 rounded-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm font-semibold text-foreground">
                  {usage.storageUsedGb} GB / {usage.storageLimitGb} GB
                </span>
              </div>
              <Progress value={storagePercent} className="h-2.5 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plan Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Plans</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => {
            const Icon = iconMap[plan.icon] || Zap;
            const isCurrent = plan.name.toLowerCase() === currentPlanName.toLowerCase();
            const btnState = getButtonState(plan.order);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`glass rounded-2xl p-5 relative overflow-hidden flex flex-col transition-all ${
                  isCurrent ? "ring-2 ring-primary/40 shadow-lg shadow-primary/10 scale-[1.02]" : ""
                } ${plan.popular && !isCurrent ? "ring-1 ring-primary/20" : ""}`}
              >
                {isCurrent ? (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-[10px] px-2 py-0.5">Current</Badge>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-2 py-0.5">Popular</Badge>
                  </div>
                ) : null}

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    isCurrent ? "gradient-primary shadow-md shadow-primary/20" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>

                <h4 className="font-semibold text-foreground text-sm">{plan.name}</h4>
                <div className="flex items-baseline gap-0.5 mt-1 mb-1">
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{plan.repliesPerDay} replies</p>

                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {btnState === "current" ? (
                  <Button size="sm" variant="outline" className="w-full border-primary/20 text-primary cursor-default" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Link to="/dashboard/upgrade">
                    <Button
                      size="sm"
                      className={`w-full ${
                        btnState === "downgrade"
                          ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                          : "gradient-primary text-primary-foreground hover:opacity-90 btn-glow"
                      }`}
                    >
                      {btnState === "downgrade" ? "Downgrade" : "Upgrade"}
                    </Button>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Receipt className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Invoices</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            View All
          </Button>
        </div>

        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No invoices yet.</p>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 first:pt-0 last:pb-0 gap-2 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                    <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 ml-11 sm:ml-0">
                  <span className="text-sm font-semibold text-foreground">{inv.amount}</span>
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                    {inv.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleDownloadInvoice(inv.id, inv.downloadUrl)}
                    title="Download invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Billing;
