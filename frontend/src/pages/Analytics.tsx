import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { getAnalyticsOverview, getAnalyticsReviews, getAnalyticsPerformance } from "@/lib/api";

const tooltipStyle = {
  backgroundColor: "hsl(224, 71%, 6%)",
  border: "1px solid hsl(216, 34%, 17%)",
  borderRadius: "8px",
  color: "hsl(213, 31%, 91%)",
};

const Analytics = () => {
  const [reviewsOverTime, setReviewsOverTime] = useState<Array<{ month: string; reviews: number }>>([]);
  const [platformData, setPlatformData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [replySuccess, setReplySuccess] = useState<Array<{ month: string; rate: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch overview data
      const overview = await getAnalyticsOverview();
      
      // Fetch reviews for platform breakdown
      const reviewsResponse = await getAnalyticsReviews({ limit: 100 });

      // Process reviews over time (group by month)
      if (reviewsResponse.reviews && reviewsResponse.reviews.length > 0) {
        const monthlyData: Record<string, number> = {};
        reviewsResponse.reviews.forEach((review) => {
          if (review.createdAt) {
            const month = new Date(review.createdAt).toLocaleString('default', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + 1;
          }
        });
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setReviewsOverTime(
          months.map(month => ({
            month,
            reviews: monthlyData[month] || 0,
          }))
        );

        // Platform breakdown
        const platformCounts: Record<string, number> = {};
        reviewsResponse.reviews.forEach((review) => {
          platformCounts[review.platform] = (platformCounts[review.platform] || 0) + 1;
        });
        
        const total = reviewsResponse.reviews.length;
        const colors: Record<string, string> = {
          "Google": "hsl(239, 84%, 67%)",
          "Yelp": "hsl(142, 71%, 45%)",
          "TripAdvisor": "hsl(188, 94%, 43%)",
          "App Store": "hsl(45, 93%, 47%)",
          "Play Store": "hsl(0, 84%, 60%)",
        };
        
        setPlatformData(
          Object.entries(platformCounts).map(([name, value]) => ({
            name,
            value: Math.round((value / total) * 100),
            color: colors[name] || "hsl(215, 20%, 65%)",
          }))
        );
      } else {
        // Default empty data
        setReviewsOverTime([]);
        setPlatformData([]);
      }

      // Fetch real reply success data from backend using performance endpoint
      const performanceResponse = await getAnalyticsPerformance();
      if (performanceResponse.success && performanceResponse.performance?.daily) {
        setReplySuccess(performanceResponse.performance.daily.map((d: any) => {
          const date = new Date(d._id);
          const rate = d.totalReviews > 0 ? Math.round((d.processed / d.totalReviews) * 100) : 0;
          return {
            month: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
            rate
          };
        }));
      } else {
        setReplySuccess([]);
      }

    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "Failed to load analytics");
      
      // Set empty data on error
      setReviewsOverTime([]);
      setPlatformData([]);
      setReplySuccess([]);
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
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into your review performance.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Reviews Over Time</h3>
          {reviewsOverTime.some(r => r.reviews > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reviewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 34%, 17%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="reviews" fill="hsl(239, 84%, 67%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
                <p className="text-sm">Connect a platform to see analytics</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Platform Breakdown</h3>
          {platformData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                    {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {platformData.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="text-foreground ml-auto">{p.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No platform data yet
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Reply Success Rate</h3>
          {replySuccess.some(r => r.rate > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={replySuccess}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 34%, 17%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[80, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No reply data yet
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
