import { motion } from "framer-motion";

const blobs = [
  { className: "top-[10%] left-[15%] w-[500px] h-[500px] bg-primary/20", delay: 0, duration: 18 },
  { className: "top-[50%] right-[10%] w-[400px] h-[400px] bg-accent/20", delay: 2, duration: 22 },
  { className: "bottom-[10%] left-[30%] w-[350px] h-[350px] bg-secondary/15", delay: 4, duration: 20 },
  { className: "top-[20%] right-[30%] w-[300px] h-[300px] bg-primary/10", delay: 6, duration: 25 },
];

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Animated gradient blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[130px] ${blob.className}`}
          animate={{
            x: [0, 60, -40, 20, 0],
            y: [0, -50, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}

      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, hsl(var(--accent) / 0.08) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, hsl(var(--secondary) / 0.06) 0%, transparent 50%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
