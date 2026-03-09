import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo - left, static */}
        <Link to="/">
          <Logo size="md" />
        </Link>

        {/* Center - glassmorphism dynamic island for nav links */}
        <div className="hidden md:block">
          <motion.div
            className="flex items-center gap-1 rounded-full bg-background/30 backdrop-blur-2xl border border-border/20 px-2 py-1.5 shadow-lg shadow-primary/5"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full px-4 py-1.5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Right - single Login/Signup pill button */}
        <div className="hidden md:block">
          <motion.button
            onClick={() => navigate("/login")}
            className="relative rounded-full gradient-primary text-primary-foreground px-5 py-2 text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Login / Sign up
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-2xl border-t border-border/20 overflow-hidden mx-4 rounded-2xl mt-1"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="mt-2 w-full rounded-full gradient-primary text-primary-foreground py-2.5 text-sm font-semibold shadow-md shadow-primary/25"
              >
                Login / Sign up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
