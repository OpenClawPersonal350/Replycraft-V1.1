import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight, Heart, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const perks = [
  { icon: Globe, title: "Remote-First", description: "Work from anywhere. We're distributed across 12 countries." },
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and mental health coverage." },
  { icon: Zap, title: "Learning Budget", description: "$2,000/year for courses, conferences, and professional growth." },
];

const openings = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "ML Engineer — NLP", team: "AI/ML", location: "Remote", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote / SF", type: "Full-time" },
  { title: "Developer Relations Engineer", team: "Developer Experience", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", team: "Customer Success", location: "Remote / NYC", type: "Full-time" },
  { title: "Content Marketing Lead", team: "Marketing", location: "Remote", type: "Full-time" },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Join ReplyCraft</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of AI-powered customer engagement. We're looking for passionate people who want to make an impact.
            </p>
          </motion.div>

          {/* Perks */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {perks.map((perk, i) => (
              <motion.div key={perk.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass rounded-xl p-6 text-center card-hover">
                <perk.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{perk.title}</h3>
                <p className="text-sm text-muted-foreground">{perk.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Openings */}
          <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
          <div className="space-y-3">
            {openings.map((job, i) => (
              <motion.a
                key={job.title}
                href="#"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass rounded-xl p-5 flex items-center justify-between card-hover group block"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Briefcase className="w-3 h-3" /> {job.team}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <Badge variant="outline" className="text-xs">{job.type}</Badge>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;
