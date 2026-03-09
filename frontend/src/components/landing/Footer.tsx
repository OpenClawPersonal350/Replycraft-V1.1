import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

const links = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Documentation", href: "/docs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
        >
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">AI-powered review management for modern businesses.</p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wider text-xs">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
        <div className="border-t border-border/30 mt-12 pt-8 text-center text-xs text-muted-foreground">
          © 2026 ReplyCraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
