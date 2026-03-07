import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly, including account details (name, email, password), business information, and review platform credentials. We also collect usage data, device information, and analytics through cookies and similar technologies.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
              <p>Your information is used to provide and improve our services, generate AI-powered review replies, send notifications, process payments, and communicate with you about your account. We never sell your personal data to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Security</h2>
              <p>We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and SOC 2 Type II compliance. Your review data and AI-generated replies are encrypted and stored securely.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Retention</h2>
              <p>We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days. Aggregated, anonymized data may be retained for analytics purposes.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
              <p>You have the right to access, correct, delete, or export your data at any time. You may also opt out of marketing communications. For GDPR and CCPA requests, contact privacy@replycraft.ai.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Contact</h2>
              <p>For privacy-related questions, contact us at privacy@replycraft.ai or write to ReplyCraft Inc., 548 Market St, Suite 36451, San Francisco, CA 94104.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Privacy;
