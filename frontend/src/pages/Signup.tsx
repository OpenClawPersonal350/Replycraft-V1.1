import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Check, X, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { AuthBackground } from "@/components/AuthBackground";
import { useToast } from "@/hooks/use-toast";
import { apiClient, setAuthToken, setFirebaseToken, loginWithGoogle } from "@/api/client";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One symbol (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const ruleResults = useMemo(() => passwordRules.map((r) => r.test(password)), [password]);
  const allRulesPassed = ruleResults.every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Handle email/password signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!allRulesPassed || !passwordsMatch || !termsAccepted) return;

    setIsSubmitting(true);
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Update profile with name
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Send to backend to create user
      const response = await apiClient<{ user: unknown; token: string }>('/auth/firebase-login', {
        method: 'POST',
        body: { 
          idToken, 
          email: email.trim(),
          name: name.trim()
        }
      });
      
      setFirebaseToken(idToken);
      setAuthToken(response.token);
      
      toast({
        title: "Account created!",
        description: "Welcome to ReplyCraft!",
      });
      
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          setError('An account with this email already exists');
        } else if (err.message.includes('auth/weak-password')) {
          setError('Password is too weak');
        } else {
          setError(err.message);
        }
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign-In (works for both login and signup)
  const handleGoogleSignup = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error('Google signup error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
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

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Create account</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Start your free trial today</p>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full mb-6 bg-card hover:bg-muted/50 border-border text-foreground gap-3 h-11"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
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

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Live password validation */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-1">
              {passwordRules.map((rule, i) => (
                <div key={rule.label} className="flex items-center gap-1.5">
                  {ruleResults[i] ? (
                    <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-destructive shrink-0" />
                  )}
                  <span className={`text-[11px] ${ruleResults[i] ? "text-secondary" : "text-muted-foreground"}`}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-[11px] text-destructive px-1">Passwords do not match</p>
          )}

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(v) => setTermsAccepted(v === true)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={!allRulesPassed || !passwordsMatch || !termsAccepted || isSubmitting}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 mt-2 h-11 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
