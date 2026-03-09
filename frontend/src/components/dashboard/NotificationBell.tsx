import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, MessageSquare, AlertTriangle, CheckCircle2, Star, Clock,
  Trash2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "review" | "alert" | "system" | "reply";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "review", title: "New 5-star review", message: "Sarah M. left a review on Google", time: "2 min ago", read: false },
  { id: "2", type: "alert", title: "Negative review alert", message: "1-star review detected on Yelp from David W.", time: "15 min ago", read: false },
  { id: "3", type: "reply", title: "AI reply sent", message: "Auto-reply sent to James L. on Google", time: "1 hour ago", read: false },
  { id: "4", type: "system", title: "Sync complete", message: "Successfully synced 12 new reviews from all platforms", time: "2 hours ago", read: true },
  { id: "5", type: "review", title: "New 4-star review", message: "Mike R. left a review on TripAdvisor", time: "5 hours ago", read: true },
  { id: "6", type: "alert", title: "Usage warning", message: "You've used 90% of your daily AI replies", time: "6 hours ago", read: true },
];

const typeConfig = {
  review: { icon: Star, color: "text-yellow-500 bg-yellow-500/10" },
  alert: { icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  system: { icon: CheckCircle2, color: "text-secondary bg-secondary/10" },
  reply: { icon: MessageSquare, color: "text-primary bg-primary/10" },
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative rounded-xl"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-background"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0 bg-card border-border rounded-xl shadow-2xl overflow-hidden"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">You're all caught up!</p>
            </div>
          ) : (
            <div className="py-1">
              <AnimatePresence>
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={() => markRead(notification.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors relative ${
                        !notification.read ? "bg-primary/[0.03]" : ""
                      }`}
                    >
                      {!notification.read && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${!notification.read ? "text-foreground" : "text-foreground/70"}`}>
                          {notification.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{notification.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {notification.time}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border/50 p-2">
            <Link
              to="/dashboard/reviews"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-primary hover:text-primary/80 font-medium py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
            >
              View all activity →
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
