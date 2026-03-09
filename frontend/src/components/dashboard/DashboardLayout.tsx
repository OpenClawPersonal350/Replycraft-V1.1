import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, BarChart3, Plug, Settings, CreditCard, LogOut,
  Bell, Search, Menu, ChevronRight, Sparkles, PanelLeftClose, PanelLeft, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUser } from "@/contexts/UserContext";
import { NotificationBell } from "./NotificationBell";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Reviews", icon: MessageSquare, path: "/dashboard/reviews" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Integrations", icon: Plug, path: "/dashboard/integrations" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  { label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";
  const mainMargin = collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]";

  const SidebarNav = ({ isMobile = false }: { isMobile?: boolean }) => {
    const showText = isMobile || !collapsed;

    return (
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-2 pt-4 space-y-1">
          {showText && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-2">Menu</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl text-sm transition-all duration-200 ${
                  showText ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
                } ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 transition-all duration-200 ${isActive ? "text-primary" : "group-hover:scale-110"}`} />
                {showText && item.label}
                {showText && isActive && (
                  <motion.div layoutId={isMobile ? "sidebar-active-mobile" : "sidebar-active"} className="ml-auto">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </Link>
            );

            if (!showText) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {showText ? (
          <div className="px-3 pb-3">
            <div className="rounded-xl gradient-primary p-4 text-center">
              <Sparkles className="w-5 h-5 text-primary-foreground mx-auto mb-2" />
              <p className="text-xs font-semibold text-primary-foreground mb-1">Upgrade to Ultra</p>
              <p className="text-[10px] text-primary-foreground/70 mb-3">Get 5,000 replies/day</p>
              <Link to="/dashboard/upgrade">
                <Button size="sm" className="w-full bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 backdrop-blur-sm text-xs h-8">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-2 pb-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/dashboard/upgrade" className="flex items-center justify-center w-full">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Upgrade to Ultra</TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="px-2 pb-4 border-t border-border/50 pt-3">
          {showText ? (
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Logout
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex items-center justify-center py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Logout</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 sm:h-16 bg-[hsl(var(--glass-bg)/0.8)] backdrop-blur-2xl sticky top-0 z-40 flex items-center px-3 sm:px-4 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <Logo size="sm" showText className="shrink-0 hidden sm:flex" />
          <Logo size="sm" className="shrink-0 sm:hidden" />
        </div>

        <div className="relative flex-1 max-w-lg mx-auto hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews, platforms..."
            className="pl-10 bg-muted/30 border-border/60 text-foreground placeholder:text-muted-foreground h-9 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
          <ThemeSwitcher />
          <NotificationBell />
          <Link to="/dashboard/settings" className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-border/50">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-border bg-muted/50 flex items-center justify-center shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <span className="hidden md:inline text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {user.plan}
            </span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className={`hidden lg:block ${sidebarWidth} bg-[hsl(var(--glass-bg)/0.8)] backdrop-blur-2xl fixed top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-30`}>
          <SidebarNav />
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-16 w-[260px] h-[calc(100vh-4rem)] bg-[hsl(var(--glass-bg)/0.8)] backdrop-blur-2xl z-50 lg:hidden"
              >
                <SidebarNav isMobile />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className={`flex-1 ${mainMargin} transition-all duration-300`}>
          <main className="p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
