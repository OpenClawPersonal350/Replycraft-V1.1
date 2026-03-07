import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-base", inner: "w-3 h-3" },
    md: { icon: "w-8 h-8", text: "text-xl", inner: "w-4 h-4" },
    lg: { icon: "w-10 h-10", text: "text-2xl", inner: "w-5 h-5" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("relative rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20", s.icon)}>
        {/* Custom "R" mark with reply arrow */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={s.inner}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 5h8a5 5 0 0 1 0 10H8l-4 4V5z"
            fill="currentColor"
            className="text-primary-foreground"
            opacity="0.9"
          />
          <path
            d="M13 10l3-3m0 0l3 3m-3-3v8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          />
        </svg>
        {/* Subtle glow dot */}
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary animate-pulse" />
      </div>
      {showText && (
        <span className={cn("font-bold text-foreground tracking-tight", s.text)}>
          Reply<span className="text-primary">Craft</span>
        </span>
      )}
    </div>
  );
}
