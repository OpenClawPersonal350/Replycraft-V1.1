import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@replycraft.com",
    helper: "Best for product and support questions",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (800) 555-0134",
    helper: "Mon–Fri, 9:00 AM to 6:00 PM",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "San Francisco, CA",
    helper: "Remote-first team worldwide",
  },
];

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    form.reset();
    toast({
      title: "Message sent successfully!",
      description: "We'll contact you shortly. Usually it takes 24–48 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us what you need and we’ll help you get the most out of ReplyCraft.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-6">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6 border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Ways to reach us</h2>
              <div className="space-y-4">
                {contactMethods.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/60 bg-card/30 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-md gradient-primary flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-foreground/90">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.helper}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-xl p-6 border border-border"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Send a message</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="First name" aria-label="First name" className="bg-muted/20 border-border" />
                  <Input placeholder="Last name" aria-label="Last name" className="bg-muted/20 border-border" />
                </div>
                <Input placeholder="Work email" type="email" aria-label="Work email" className="bg-muted/20 border-border" />
                <Input placeholder="Company" aria-label="Company" className="bg-muted/20 border-border" />
                <Textarea
                  placeholder="How can we help?"
                  aria-label="How can we help"
                  rows={6}
                  className="bg-muted/20 border-border resize-none"
                />
                <Button type="submit" className="w-full gradient-primary text-primary-foreground btn-glow">
                  Send message
                </Button>
              </form>
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
