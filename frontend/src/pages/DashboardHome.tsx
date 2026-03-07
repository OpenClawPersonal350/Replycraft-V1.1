import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bot, Star, Clock, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getAnalyticsOverview, AnalyticsOverview, getAnalyticsSentiment } from "@/lib/api";

interface Stats {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

const DashboardHome = () => {
  const [stats, setStats] = useState<Stats[]>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; reviews: number; replies: number }>>([]);
  const [sentimentData, setSentimentData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [data, sentimentRes] = await Promise.all([
        getAnalyticsOverview(),
        getAnalyticsSentiment()
      ]);
      
      // Transform API data to stats
      setStats([
        { 
          label: "Total Reviews", 
          value: data.totalReviews?.toLocaleString() || "0", 
          change: "+12%", 
          icon: MessageSquare, 
          color: "text-primary" 
        },
        { 
          label: "AI Replies Sent", 
          value: data.totalReplies?.toLocaleString() || "0", 
          change: "+8%", 
          icon: Bot, 
          color: "text-secondary" 
        },
        { 
          label: "Average Rating", 
          value: data.averageRating?.toFixed(1) || "0.0", 
          change: "+0.2", 
          icon: Star, 
          color: "text-accent" 
        },
        { 
          label: "Pending Approvals", 
          value: data.pendingApprovals?.toString() || "0", 
          change: "-5", 
          icon: Clock, 
          color: "text-destructive" 
        },
      ]);

      // Set chart data
      if (data.reviewsOverTime && data.reviewsOverTime.length > 0) {
        setChartData(data.reviewsOverTime);
      } else {
        // Default empty data
        setChartData([]);
      }

      // Set sentiment data
      if (sentimentRes.success && sentimentRes.sentiment) {
        const breakdown = sentimentRes.sentiment.breakdown;
        setSentimentData([
          { name: "Positive", value: breakdown.positive || 0, color: "hsl(142, 71%, 45%)" },
          { name: "Neutral", value: breakdown.neutral || 0, color: "hsl(239, 84%, 67%)" },
          { name: "Negative", value: breakdown.negative || 0, color: "hsl(0, 84%, 60%)" },
        ]);
      } else {
        setSentimentData([
          { name: "Positive", value: 0, color: "hsl(142, 71%, 45%)" },
          { name: "Neutral", value: 0, color: "hsl(239, 84%, 67%)" },
          { name: "Negative", value: 0, color: "hsl(0, 84%, 60%)" },
        ]);
      }

    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      
      // Set empty stats on error
      setStats([
        { label: "Total Reviews", value: "0", change: "+0%", icon: MessageSquare, color: "text-primary" },
        { label: "AI Replies Sent", value: "0", change: "+0%", icon: Bot, color: "text-secondary" },
        { label: "Average Rating", value: "0.0", change: "+0", icon: Star, color: "text-accent" },
        { label: "Pending Approvals", value: "0", change: "-0", icon: Clock, color: "text-destructive" },
      ]);
      setChartData([]);
      setSentimentData([
        { name: "Positive", value: 0, color: "hsl(142, 71%, 45%)" },
        { name: "Neutral", value: 0, color: "hsl(239, 84%, 67%)" },
        { name: "Negative", value: 0, color: "hsl(0, 84%, 60%)" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your review management.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-secondary">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5 lg:col-span-2"
        >
          <h3 className="font-semibold text-foreground mb-4">Replies Over Time</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 34%, 17%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(224, 71%, 6%)",
                    border: "1px solid hsl(216, 34%, 17%)",
                    borderRadius: "8px",
                    color: "hsl(213, 31%, 91%)",
                  }}
                />
                <Area type="monotone" dataKey="reviews" stroke="hsl(239, 84%, 67%)" fill="url(#colorReviews)" strokeWidth={2} />
                <Area type="monotone" dataKey="replies" stroke="hsl(142, 71%, 45%)" fill="url(#colorReplies)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              No data available. Connect a platform to see analytics.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Sentiment</h3>
          {sentimentData.some(s => s.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {sentimentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {sentimentData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground">{s.name}</span>
                    </div>
                    <span className="text-foreground font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              No sentiment data available.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
