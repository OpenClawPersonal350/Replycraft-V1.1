import { motion } from "framer-motion";
import { MessageSquare, Bot, Star, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDashboardData } from "@/api/hooks";
import { PageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useUser } from "@/contexts/UserContext";

const iconMap: Record<string, React.ElementType> = {
  "Total Reviews": MessageSquare,
  "AI Replies Sent": Bot,
  "Average Rating": Star,
  "Pending Approvals": Clock,
};

const gradientMap: Record<string, string> = {
  "Total Reviews": "from-primary to-accent",
  "AI Replies Sent": "from-secondary to-accent",
  "Average Rating": "from-yellow-500 to-orange-500",
  "Pending Approvals": "from-destructive to-orange-500",
};

const activityIcons: Record<string, string> = {
  reply: "bg-secondary/10 text-secondary",
  review: "bg-primary/10 text-primary",
  alert: "bg-destructive/10 text-destructive",
};

const DashboardHome = () => {
  const { data, isLoading, error } = useDashboardData();
  const { user } = useUser();

  if (isLoading) return <PageSkeleton />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Unable to load dashboard</h2>
        <p className="text-sm text-muted-foreground">{error?.message || "Please try again later."}</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Reviews", value: data.stats.totalReviews.toLocaleString(), change: data.stats.totalReviewsChange, up: !data.stats.totalReviewsChange.startsWith("-") },
    { label: "AI Replies Sent", value: data.stats.aiRepliesSent.toLocaleString(), change: data.stats.aiRepliesChange, up: !data.stats.aiRepliesChange.startsWith("-") },
    { label: "Average Rating", value: String(data.stats.averageRating), change: data.stats.averageRatingChange, up: !data.stats.averageRatingChange.startsWith("-") },
    { label: "Pending Approvals", value: String(data.stats.pendingApprovals), change: data.stats.pendingApprovalsChange, up: data.stats.pendingApprovalsChange.startsWith("-") },
  ];

  const firstName = user.fullName?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your reviews today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/reviews">
            <Button variant="outline" size="sm" className="border-border/60 text-foreground gap-2 rounded-xl h-9">
              <Eye className="w-3.5 h-3.5" /> View Reviews
            </Button>
          </Link>
          <Link to="/dashboard/analytics">
            <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 rounded-xl h-9">
              <TrendingUp className="w-3.5 h-3.5" /> Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.label] || MessageSquare;
          const gradient = gradientMap[stat.label] || "from-primary to-accent";
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-5 group cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${stat.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Reviews & Replies</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly overview</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Replies</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="reviews" stroke="hsl(239, 84%, 67%)" fill="url(#colorReviews)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="replies" stroke="hsl(142, 71%, 45%)" fill="url(#colorReplies)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {data.recentActivity.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${activityIcons[item.type] || "bg-muted"}`}>
                  {item.type === "reply" && <Bot className="w-3.5 h-3.5" />}
                  {item.type === "review" && <Star className="w-3.5 h-3.5" />}
                  {item.type === "alert" && <MessageSquare className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sentiment + Quick stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Sentiment Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data.sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                {data.sentimentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {data.sentimentData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground text-xs">{s.name}</span>
                </div>
                <span className="text-foreground font-semibold text-xs">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Response time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-1">Avg. Response Time</h3>
            <p className="text-xs text-muted-foreground mb-4">How fast AI replies go out</p>
          </div>
          <div className="text-center py-6">
            <p className="text-5xl font-bold gradient-text">{data.avgResponseTime}</p>
            <p className="text-xs text-muted-foreground mt-2">Industry average: 4.2 hours</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-secondary">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>99.7% faster than competitors</span>
          </div>
        </motion.div>

        {/* Auto-reply rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-1">Auto-Reply Rate</h3>
            <p className="text-xs text-muted-foreground mb-4">Reviews handled automatically</p>
          </div>
          <div className="text-center py-6">
            <p className="text-5xl font-bold gradient-text">{data.autoReplyRate}%</p>
            <p className="text-xs text-muted-foreground mt-2">{data.autoReplyCount.toLocaleString()} of {data.autoReplyTotal.toLocaleString()} replies</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Link to="/dashboard/settings">
              <Button variant="outline" size="sm" className="text-xs border-border/60 rounded-xl h-8">
                Adjust Settings
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
