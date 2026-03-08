import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PlanInfo {
  id: string;
  name: string;
  price: number;
  pricePaise: number;
  dailyLimit: number;
  perMinute: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
    currentPeriodEnd: number | null;
    dailyLimit: number;
  } | null>(null);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const razorpayLoaded = useRef(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    if (!razorpayLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        razorpayLoaded.current = true;
      };
      document.body.appendChild(script);
    }

    fetchSubscription();
    fetchPlans();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscription();
      if (response.success) {
        setSubscription({
          plan: response.plan || 'free',
          status: response.status || 'active',
          currentPeriodEnd: response.currentPeriodEnd,
          dailyLimit: response.dailyLimit || 5
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setSubscription({
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        dailyLimit: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await apiService.getSubscription();
      // API returns plans in a different format
      if (response.success && response.plans) {
        setPlans(response.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment system not loaded",
        description: "Please refresh the page and try again"
      });
      return;
    }

    try {
      setProcessing(planId);
      
      // Create Razorpay order
      const orderData = await apiService.createCheckoutSession(planId);
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { orderId, keyId, amount, plan } = orderData;

      // Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount: amount,
        currency: 'INR',
        name: 'ReplyCraft',
        description: `${plan.name} Plan - ${plan.dailyLimit} replies/day`,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyData = await apiService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              planId
            );

            if (verifyData.success) {
              toast({
                title: "Payment successful!",
                description: `You are now on the ${plan.name} plan`
              });
              fetchSubscription();
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Payment verification failed",
              description: error.message
            });
          }
          setProcessing(null);
        },
        prefill: {
          name: subscription?.plan || 'User',
          email: 'user@example.com'
        },
        theme: {
          color: '#6366f1'
        }
      });

      razorpay.open();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message
      });
      setProcessing(null);
    }
  };

  const currentPlan = subscription?.plan || 'free';

  // Default plans (in case API fails)
  const defaultPlans: PlanInfo[] = [
    { id: 'free', name: 'Free', price: 0, pricePaise: 0, dailyLimit: 5, perMinute: 2 },
    { id: 'go', name: 'Go', price: 299, pricePaise: 29900, dailyLimit: 200, perMinute: 10 },
    { id: 'pro', name: 'Pro', price: 799, pricePaise: 79900, dailyLimit: 1000, perMinute: 30 },
    { id: 'ultra', name: 'Ultra', price: 1999, pricePaise: 199900, dailyLimit: 5000, perMinute: 100 }
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription plan.</p>
      </div>

      {/* Current Plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-foreground">Current Plan</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {currentPlan.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          {subscription?.dailyLimit || 5} replies/day
        </p>
        <p className="text-xs text-muted-foreground">
          {subscription?.status === 'active' && subscription?.currentPeriodEnd 
            ? `Next billing date: ${formatDate(subscription.currentPeriodEnd)}`
            : subscription?.status === 'past_due' 
              ? 'Payment past due - Please update your payment method'
              : subscription?.status === 'canceled'
                ? 'Subscription canceled'
                : 'Current plan'
          }
        </p>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayPlans.map((plan, i) => {
          const isCurrent = plan.id === currentPlan;
          const isPopular = plan.id === 'pro';
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass rounded-xl p-5 text-center relative ${
                isCurrent ? "glow-primary border-primary/30" : ""
              } ${isPopular ? "border-indigo-500/30" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-500 text-white text-xs">
                    <Zap className="w-3 h-3 mr-1" /> Popular
                  </Badge>
                </div>
              )}
              
              <h4 className="font-semibold text-foreground mb-1">{plan.name}</h4>
              <p className="text-xl font-bold text-foreground mb-1">
                {plan.price === 0 ? '₹0' : `₹${plan.price}`}
                {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {plan.dailyLimit.toLocaleString()} replies/day
              </p>
              
              {isCurrent ? (
                <Button size="sm" className="w-full bg-muted text-muted-foreground cursor-default" disabled>
                  <Check className="w-4 h-4 mr-1" /> Current
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className={`w-full ${
                    plan.price > (displayPlans.find(p => p.id === currentPlan)?.price || 0)
                      ? 'gradient-primary text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={processing !== null}
                >
                  {processing === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : plan.price > (displayPlans.find(p => p.id === currentPlan)?.price || 0) ? (
                    'Upgrade'
                  ) : (
                    'Switch'
                  )}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Features */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Daily AI Replies', values: ['5', '200', '1,000', '5,000'] },
              { name: 'Per Minute', values: ['2', '10', '30', '100'] },
              { name: 'Analytics', values: ['Basic', 'Advanced', 'Advanced', 'Advanced'] },
              { name: 'Email Support', values: ['❌', '✅', '✅', 'Priority'] }
            ].map((feature, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                <span className="text-sm text-muted-foreground">{feature.name}</span>
                <div className="flex gap-4">
                  {feature.values.map((val, j) => (
                    <span key={j} className="text-sm font-medium w-16 text-right">{val}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
