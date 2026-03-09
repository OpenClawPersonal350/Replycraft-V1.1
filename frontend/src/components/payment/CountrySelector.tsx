import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Globe } from "lucide-react";
import { countries } from "@/data/countries";

interface CountrySelectorProps {
  selectedCode: string;
  onSelect: (code: string) => void;
}

export const CountrySelector = ({ selectedCode, onSelect }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = countries.find((c) => c.code === selectedCode);
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-sm w-full"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        {selected ? (
          <>
            <span className="text-lg leading-none">{selected.flag}</span>
            <span className="text-foreground font-medium">{selected.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select country</span>
        )}
        <ChevronDown className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-hidden"
          >
            <div className="p-2 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-8 pr-3 py-1.5 bg-muted/30 border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {filtered.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onSelect(country.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted/40 transition-colors ${
                    country.code === selectedCode ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  <span className="text-lg leading-none">{country.flag}</span>
                  <span className="font-medium">{country.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{country.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground p-3 text-center">No countries found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
