import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/useAuth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting registration...');
      const response = await register(name, email, password);
      console.log('Registration response:', response);
      
      if (response.success) {
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 gradient-radial" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-[120px]"
      />

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

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              required
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
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 mt-2 h-11"
            disabled={loading}
          >
            {loading ? 'Creating account...' : `Create account`} <ArrowRight className="w-4 h-4" />
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
