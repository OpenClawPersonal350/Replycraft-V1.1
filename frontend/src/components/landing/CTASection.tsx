import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] rounded-full bg-primary/8 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/8 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/8 blur-[80px]" />
          </div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Start Automating Your <br className="hidden sm:block" />Reviews Today
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
              Join thousands of businesses using ReplyCraft to save time and delight customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-10 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border/60 text-foreground hover:bg-muted/50 backdrop-blur-sm">
                Book Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
