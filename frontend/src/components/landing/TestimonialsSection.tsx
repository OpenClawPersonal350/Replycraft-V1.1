import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Emily Chen",
    role: "Restaurant Owner",
    quote: "ReplyCraft saves us 10+ hours per week. Our review response rate went from 30% to 98%.",
    rating: 5,
    avatar: "EC",
  },
  {
    name: "Marcus Johnson",
    role: "Hotel Manager",
    quote: "The AI replies are incredibly natural. Guests can't tell they're automated.",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Sofia Rodriguez",
    role: "E-commerce Director",
    quote: "Managing reviews across 5 platforms used to be a nightmare. ReplyCraft made it effortless.",
    rating: 5,
    avatar: "SR",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full bg-secondary/5 blur-[150px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-secondary mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Loved by <span className="gradient-text">businesses</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-2xl p-7 transition-all duration-300 hover:border-primary/15 hover:shadow-xl hover:shadow-primary/5 relative"
            >
              <Quote className="w-8 h-8 text-primary/10 absolute top-5 right-5" />
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
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
