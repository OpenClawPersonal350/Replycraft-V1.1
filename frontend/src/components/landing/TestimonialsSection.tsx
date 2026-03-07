import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Chen",
    role: "Restaurant Owner",
    quote: "ReplyCraft saves us 10+ hours per week. Our review response rate went from 30% to 98%.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Hotel Manager",
    quote: "The AI replies are incredibly natural. Guests can't tell they're automated.",
    rating: 5,
  },
  {
    name: "Sofia Rodriguez",
    role: "E-commerce Director",
    quote: "Managing reviews across 5 platforms used to be a nightmare. ReplyCraft made it effortless.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">businesses</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
