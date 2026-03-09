import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  TrendingUp, TrendingDown, MessageSquare, Star, Clock, Zap,
  ArrowUpRight, CalendarDays, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useAnalyticsOverview } from "@/api/hooks";
import { PageSkeleton } from "@/components/dashboard/DashboardSkeleton";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-xl p-3 shadow-xl border border-border/50">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="text-foreground font-medium">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [period, setPeriod] = useState("7months");
  const { data, isLoading, error } = useAnalyticsOverview(period);

  if (isLoading) return <PageSkeleton />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Unable to load analytics</h2>
        <p className="text-sm text-muted-foreground">{error?.message || "Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep insights into your review performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-muted/30 border-border/60 text-foreground h-9 rounded-xl">
              <CalendarDays className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="7months">Last 7 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground h-9 rounded-xl gap-2">
            <BarChart3 className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reviews & Replies Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Reviews Over Time</h3>
              <p className="text-xs text-muted-foreground">Monthly trend overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.reviewsOverTime}>
              <defs>
                <linearGradient id="reviewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reviews" stroke="hsl(239, 84%, 67%)" strokeWidth={2.5} fill="url(#reviewsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-1">Platform Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Review distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.platformDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.platformDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {data.platformDistribution.map((p) => (
              <div key={p.name} className="flex items-center gap-2.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-muted-foreground">{p.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.value}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
                <span className="text-foreground font-medium w-8 text-right">{p.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reply Success Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-foreground">Reply Success Rate</h3>
            <p className="text-xs text-muted-foreground">Monthly approval rate trend</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.replySuccessRate}>
            <defs>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="rate" stroke="hsl(142, 71%, 45%)" strokeWidth={2.5} fill="url(#rateGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Analytics;
