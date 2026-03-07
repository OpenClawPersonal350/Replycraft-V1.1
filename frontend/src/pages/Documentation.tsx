import { motion } from "framer-motion";
import { Book, Code, Zap, Settings, ArrowRight, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Set up ReplyCraft in under 5 minutes. Connect your first platform and start automating replies.",
    articles: ["Quick Start Guide", "Account Setup", "First Integration", "Dashboard Overview"],
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete REST API documentation for custom integrations and automations.",
    articles: ["Authentication", "Reviews Endpoint", "Replies Endpoint", "Webhooks", "Rate Limits"],
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Customize AI tone, reply templates, approval workflows, and notification settings.",
    articles: ["Brand Tone Setup", "Reply Templates", "Approval Modes", "Notification Preferences"],
  },
  {
    icon: Book,
    title: "Guides & Tutorials",
    description: "Step-by-step tutorials for advanced features and best practices.",
    articles: ["Multi-Platform Strategy", "AI Training Tips", "Analytics Deep Dive", "Team Collaboration"],
  },
];

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Everything you need to integrate, configure, and get the most out of ReplyCraft.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documentation..." className="pl-10 bg-muted/30 border-border h-11" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 card-hover"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="glass rounded-xl p-8 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button className="gradient-primary text-primary-foreground btn-glow gap-2">
                Contact Support <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
