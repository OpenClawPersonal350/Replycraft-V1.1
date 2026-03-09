import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { AuthBackground } from "@/components/AuthBackground";
import { useToast } from "@/hooks/use-toast";
import { useVerifyOtp, useResendOtp } from "@/api/hooks";

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  // Email passed from signup page via router state
  const email = (location.state as any)?.email || "";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;

    try {
      const result = await verifyOtpMutation.mutateAsync({ email, otp: code });
      if (result.token) {
        localStorage.setItem("auth_token", result.token);
      }
      toast({ title: "Email verified!", description: "Let's set up your profile." });
      navigate("/onboarding/profile");
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await resendOtpMutation.mutateAsync({ email });
      setResendCooldown(30);
      toast({ title: "OTP resent", description: "Check your email for the new code." });
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 w-full max-w-md relative z-10 glow-primary"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
            <Mail className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Verify your email</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          We've sent a 6-digit code to {email || "your email address"}. Enter it below to continue.
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 mb-8 px-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl bg-muted/50 border-2 border-border text-foreground
                focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          disabled={!isComplete || verifyOtpMutation.isPending}
          className="w-full gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 h-11 disabled:opacity-50"
        >
          {verifyOtpMutation.isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>Verify & Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendOtpMutation.isPending}
            className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
