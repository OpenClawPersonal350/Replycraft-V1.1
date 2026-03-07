import { Palette, Moon, Sun, Building2, Cpu, Eclipse } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme, Theme } from "@/hooks/use-theme";

const themes: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "dark", label: "Default Dark", icon: Moon },
  { value: "light", label: "Warm Light", icon: Sun },
  { value: "midnight", label: "Midnight", icon: Eclipse },
  { value: "corporate", label: "Corporate", icon: Building2 },
  { value: "cyberpunk", label: "Cyberpunk", icon: Cpu },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`gap-2 ${theme === t.value ? "text-primary font-medium" : ""}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
