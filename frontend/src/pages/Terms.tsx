import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
              <p>By accessing or using ReplyCraft, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the service. These terms apply to all users, including free and paid subscribers.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. Service Description</h2>
              <p>ReplyCraft provides AI-powered review response automation across multiple platforms. The service includes review detection, AI reply generation, analytics, and team collaboration features as described in your selected plan.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. User Obligations</h2>
              <p>You agree to provide accurate account information, maintain the security of your credentials, comply with all applicable laws regarding customer communication, and not use the service for spam, harassment, or deceptive practices.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Billing & Subscriptions</h2>
              <p>Paid plans are billed monthly or annually as selected. You may cancel at any time; cancellations take effect at the end of the current billing period. Refunds are available within 30 days of initial purchase per our money-back guarantee.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Intellectual Property</h2>
              <p>AI-generated replies are considered your content. ReplyCraft retains rights to the underlying AI models and platform technology. You grant us a license to process your review data solely for the purpose of providing the service.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
              <p>ReplyCraft is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you in the 12 months preceding any claim.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Terms;
