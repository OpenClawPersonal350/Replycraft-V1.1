import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const posts = [
  {
    title: "How AI is Revolutionizing Customer Review Management in 2026",
    excerpt: "Discover how modern AI systems are transforming the way businesses interact with customer feedback across multiple platforms.",
    category: "AI & Technology",
    date: "Mar 5, 2026",
    readTime: "6 min read",
    featured: true,
  },
  {
    title: "5 Strategies to Improve Your Online Reputation with Automated Replies",
    excerpt: "Learn proven tactics for leveraging AI-powered responses to build trust and improve customer satisfaction scores.",
    category: "Strategy",
    date: "Mar 1, 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    title: "The Psychology Behind Effective Review Responses",
    excerpt: "Understanding what makes customers feel heard — and how to craft replies that turn critics into advocates.",
    category: "Insights",
    date: "Feb 25, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    title: "ReplyCraft 3.0: Smart Tone Detection and Multi-Language Support",
    excerpt: "Announcing our biggest update yet — with intelligent tone matching and support for 30+ languages.",
    category: "Product",
    date: "Feb 20, 2026",
    readTime: "3 min read",
    featured: false,
  },
  {
    title: "Case Study: How TasteHub Increased Ratings by 0.8 Stars in 3 Months",
    excerpt: "A deep dive into how a restaurant chain used ReplyCraft to transform their online presence and customer relationships.",
    category: "Case Study",
    date: "Feb 15, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    title: "The Complete Guide to Multi-Platform Review Management",
    excerpt: "Managing reviews across Google, Yelp, TripAdvisor, and app stores? Here's your comprehensive playbook.",
    category: "Guide",
    date: "Feb 10, 2026",
    readTime: "8 min read",
    featured: false,
  },
];

const Blog = () => {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-muted-foreground">Insights on AI, customer experience, and review management.</p>
          </motion.div>

          {/* Featured */}
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="block glass rounded-xl p-8 mb-10 card-hover group"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">{featured.category}</Badge>
            <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
            <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
            </div>
          </motion.a>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.a
                key={post.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className="glass rounded-xl p-6 card-hover group"
              >
                <Badge variant="outline" className="mb-3 text-xs">{post.category}</Badge>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-sm leading-snug">{post.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">Read <ArrowRight className="w-3 h-3" /></span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
