import { motion } from "framer-motion";
import { ArrowRight, Play, Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function FloatingCard({ className, delay, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay || 0 }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay || 0 }}
        className="glass rounded-xl p-4 glow-primary"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 gradient-radial" />
      
      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[100px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-glow-pulse" />
              Trusted by 2,000+ businesses
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Automate Customer Review Replies{" "}
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8"
            >
              ReplyCraft detects new reviews across platforms and generates professional replies instantly using AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity gap-2 px-8">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
                <Play className="w-4 h-4" /> Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Right - Floating cards */}
          <div className="relative h-[400px] lg:h-[500px] hidden md:block">
            <FloatingCard className="absolute top-4 right-4 max-w-[280px]" delay={0.4}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">"Amazing food and great service! Will definitely come back."</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">— Sarah M. on Google</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute top-36 left-0 max-w-[300px]" delay={0.6}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">AI Reply Generated</p>
                  <p className="text-xs text-muted-foreground">"Thank you Sarah! We're thrilled you enjoyed your experience. We look forward to welcoming you again!"</p>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-8 right-12 max-w-[240px]" delay={0.8}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <ThumbsUp className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Reply Approved</p>
                  <p className="text-xs text-secondary">Published automatically</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </section>
  );
}
