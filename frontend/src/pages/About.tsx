import { motion } from "framer-motion";
import { Target, Users, Globe, Award } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const values = [
  { icon: Target, title: "Mission-Driven", description: "We believe every business deserves professional, thoughtful responses to customer feedback — powered by AI that understands context and tone." },
  { icon: Users, title: "Customer-First", description: "Built by a team obsessed with customer experience. Every feature is designed to strengthen the relationship between businesses and their customers." },
  { icon: Globe, title: "Global Scale", description: "Supporting businesses across 50+ countries with multi-language AI that adapts to cultural nuances and local expectations." },
  { icon: Award, title: "Excellence", description: "We hold ourselves to the highest standards. Our AI models are continuously trained on millions of real interactions for best-in-class accuracy." },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", bio: "Ex-Google, Stanford CS. Built ML systems serving 500M+ users." },
  { name: "Marcus Rivera", role: "CTO & Co-Founder", bio: "Ex-Stripe, MIT. 15 years in distributed systems and AI infrastructure." },
  { name: "Aisha Patel", role: "VP of Engineering", bio: "Ex-Linear. Led engineering teams building developer-loved products." },
  { name: "James O'Brien", role: "Head of Product", bio: "Ex-Vercel. Product leader focused on intuitive, beautiful experiences." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">About ReplyCraft</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to help businesses build stronger customer relationships through intelligent, automated review management.
            </p>
          </motion.div>

          {/* Story */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>ReplyCraft was born in 2024 when our founders noticed a critical gap: businesses were losing customers not because of bad reviews, but because of slow or missing responses.</p>
              <p>Research showed that 53% of customers expect businesses to respond to reviews within a week, yet the average response time was over 30 days. We knew AI could bridge that gap — not by replacing the human touch, but by amplifying it.</p>
              <p>Today, ReplyCraft powers automated review responses for over 10,000 businesses worldwide, maintaining a 98% customer satisfaction rate with AI-generated replies that feel authentically human.</p>
            </div>
          </motion.div>

          {/* Values */}
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass rounded-xl p-6 card-hover">
                <v.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Leadership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass rounded-xl p-5 text-center card-hover">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center text-xl font-bold text-primary-foreground">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                <p className="text-xs text-primary mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
