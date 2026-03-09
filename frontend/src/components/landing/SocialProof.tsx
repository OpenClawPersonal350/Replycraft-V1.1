import { motion } from "framer-motion";

type Platform = {
  name: string;
  logo: string;
  showName?: boolean;
};

const platforms: Platform[] = [
  { name: "Google", logo: "/logos/google.svg", showName: false },
  { name: "Yelp", logo: "/logos/yelp.svg" },
  { name: "TripAdvisor", logo: "/logos/tripadvisor.svg" },
  { name: "App Store", logo: "/logos/appstore.svg" },
  { name: "Play Store", logo: "/logos/googleplay.svg" },
  { name: "Trustpilot", logo: "/logos/trustpilot.svg" },
];

function PlatformLogo({ name, logo, showName = true }: Platform) {
  return (
    <div className="flex items-center gap-3 shrink-0 text-foreground/70 text-lg font-semibold">
      <img
        src={logo}
        alt={`${name} logo`}
        loading="lazy"
        className="h-7 w-auto max-w-28 object-contain"
        onError={(event) => {
          const img = event.currentTarget;
          if (!img.src.endsWith("/placeholder.svg")) {
            img.src = "/placeholder.svg";
          }
        }}
      />
      {showName ? <span>{name}</span> : null}
    </div>
  );
}

export function SocialProof() {
  const loopingPlatforms = [...platforms, ...platforms];

  return (
    <section className="py-16 border-t border-border/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground/70 mb-10 uppercase tracking-widest font-medium"
        >
          Supports reviews from all major platforms
        </motion.p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee-ltr items-center gap-10 md:gap-14">
          {loopingPlatforms.map((platform, index) => (
            <PlatformLogo
              key={`${platform.name}-${index}`}
              name={platform.name}
              logo={platform.logo}
              showName={platform.showName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
