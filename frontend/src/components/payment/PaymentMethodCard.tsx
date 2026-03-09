import { motion } from "framer-motion";
import {
  CreditCard, Zap, Smartphone, Building2, Wallet, CheckCircle2,
} from "lucide-react";
import type { PaymentMethodConfig } from "@/data/payment-config";

const iconMap: Record<string, React.ReactNode> = {
  card: <CreditCard className="w-5 h-5" />,
  razorpay: <Zap className="w-5 h-5" />,
  upi: <Smartphone className="w-5 h-5" />,
  netbanking: <Building2 className="w-5 h-5" />,
  wallet: <Wallet className="w-5 h-5" />,
  paypal: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.44a.8.8 0 0 0-.79.68l-.04.22-.63 3.993-.03.17a.8.8 0 0 1-.79.68H8.72a.43.43 0 0 1-.43-.51l.58-3.72.04-.23a.8.8 0 0 1 .79-.68h.5c3.226 0 5.75-1.31 6.49-5.1.31-1.58.15-2.9-.67-3.83a3.56 3.56 0 0 0-1.02-.78c.43-.28.78-.62 1.07-1.05z" />
      <path d="M18.33 7.33a7.77 7.77 0 0 0-.95-.35 12.52 12.52 0 0 0-1.95-.22h-5.9a.8.8 0 0 0-.79.68L7.42 15.4l-.03.17a.8.8 0 0 1 .79-.68h1.64c3.84 0 6.85-1.56 7.73-6.07.03-.13.05-.26.07-.38a4.36 4.36 0 0 0-.67-.41l-.02-.01c.16-.47.27-.95.33-1.44l.07-.26z" />
    </svg>
  ),
  apple: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.51-3.23 0-1.44.62-2.2.44-3.06-.4C4.24 16.7 4.89 10.33 8.7 10.1c1.25.07 2.12.72 2.86.76.97-.2 1.91-.89 3.03-.8 1.29.1 2.26.63 2.9 1.61-2.65 1.59-2.02 5.07.36 6.04-.47 1.24-.86 2.08-1.8 3.17zM12.03 10.01c-.12-2.19 1.67-4.07 3.82-4.21.28 2.43-2.18 4.34-3.82 4.21z" />
    </svg>
  ),
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
};

interface Props {
  method: PaymentMethodConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export const PaymentMethodCard = ({ method, isSelected, onSelect }: Props) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border/40 bg-card/50 hover:border-border hover:bg-muted/20 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="payment-selected"
          className="absolute top-2.5 right-2.5"
          initial={false}
        >
          <CheckCircle2 className="w-4 h-4 text-primary" />
        </motion.div>
      )}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-muted/40 text-muted-foreground group-hover:bg-muted/60"
        }`}
      >
        {iconMap[method.icon] || <CreditCard className="w-5 h-5" />}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold truncate ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
          {method.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{method.description}</p>
      </div>
    </motion.button>
  );
};
