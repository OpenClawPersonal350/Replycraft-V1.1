import { motion } from "framer-motion";

const platforms = ["Google", "Yelp", "TripAdvisor", "App Store", "Play Store"];

export function SocialProof() {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          Supports reviews from all major platforms
        </motion.p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors text-lg font-semibold cursor-default"
            >
              {platform}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
