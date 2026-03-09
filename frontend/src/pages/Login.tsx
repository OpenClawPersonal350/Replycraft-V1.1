import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { AuthBackground } from "@/components/AuthBackground";
import { useLogin } from "@/api/hooks";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const emailValidation = useMemo(() => {
    if (!email || !emailTouched) return { valid: false, message: "" };
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return { valid: false, message: "Email must contain @" };
    const [local, domain] = trimmed.split("@");
    if (!local || local.length === 0) return { valid: false, message: "Missing username before @" };
    if (!domain || !domain.includes(".")) return { valid: false, message: "Invalid domain (e.g. gmail.com)" };
    const domainParts = domain.split(".");
    if (domainParts.some((p) => p.length === 0)) return { valid: false, message: "Invalid domain format" };
    if (domainParts[domainParts.length - 1].length < 2) return { valid: false, message: "Domain extension too short" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed)) return { valid: false, message: "Invalid email format" };
    return { valid: true, message: "" };
  }, [email, emailTouched]);

  const canSubmit = emailValidation.valid && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      navigate("/dashboard");
    } catch {
      // Same generic message for wrong email or wrong password to prevent enumeration
      setLoginError("Username or password is incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 w-full max-w-md relative z-10 glow-primary"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Log in to your account</p>

        {/* Login Error */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {loginError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full mb-6 bg-card hover:bg-muted/50 border-border text-foreground gap-3 h-11"
          onClick={() => {}}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        {/* Separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[hsl(var(--glass-bg)/0.8)] px-3 text-muted-foreground">OR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError("");
                }}
                onBlur={() => setEmailTouched(true)}
                className={`pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground ${
                  emailTouched && email && !emailValidation.valid ? "border-destructive focus-visible:ring-destructive" : ""
                } ${emailTouched && emailValidation.valid ? "border-green-500 focus-visible:ring-green-500" : ""}`}
              />
              {emailTouched && email && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailValidation.valid ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </span>
              )}
            </div>
            <AnimatePresence>
              {emailTouched && email && !emailValidation.valid && emailValidation.message && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-destructive mt-1.5 ml-1"
                >
                  {emailValidation.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 mt-2 h-11 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log in"} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
