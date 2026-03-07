import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 gradient-radial" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-12 md:p-16 text-center max-w-3xl mx-auto glow-primary"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Automating Your Reviews Today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of businesses using ReplyCraft to save time and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-8">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
              Book Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
