import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, Edit, Filter, Star, MessageSquare, Clock, CheckCircle2,
  XCircle, Sparkles, ArrowUpRight, MoreHorizontal, RefreshCw, Calendar,
  History, TrendingUp, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsExhaustedDialog } from "@/components/CreditsExhaustedDialog";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useReviews, useReviewAction } from "@/api/hooks";
import { ReviewCardSkeleton, StatsSkeleton } from "@/components/dashboard/DashboardSkeleton";
import type { Review } from "@/api/types";

const platformColors: Record<string, string> = {
  Google: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Yelp: "bg-red-500/10 text-red-600 dark:text-red-400",
  TripAdvisor: "bg-green-500/10 text-green-600 dark:text-green-400",
  "App Store": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: Clock, label: "Pending" },
  approved: { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: CheckCircle2, label: "Approved" },
  rejected: { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", icon: XCircle, label: "Rejected" },
};

const timeRanges = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

const Reviews = () => {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [activeTab, setActiveTab] = useState("reviews");
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);

  // Fetch reviews from API
  const { data: reviewsData, isLoading, error } = useReviews({
    platform: platformFilter !== "all" ? platformFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const reviewAction = useReviewAction();

  const reviews = reviewsData?.reviews ?? [];

  // Client-side search filter (server handles platform/status)
  const filtered = useMemo(() => {
    if (!searchQuery) return reviews;
    return reviews.filter((r) =>
      r.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  // History = approved + rejected
  const historyReviews = useMemo(() => {
    return reviews.filter((r) => r.status === "approved" || r.status === "rejected");
  }, [reviews]);

  const stats = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0",
  }), [reviews]);

  // Sync handler
  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    setSyncing(true);
    toast.info("Syncing reviews from all platforms...");
    // TODO: Call sync API endpoint
    setTimeout(() => {
      toast.success("Sync complete.");
      setSyncing(false);
    }, 2000);
  };

  // Approve / Reject handlers
  const handleApprove = (id: string | number) => {
    reviewAction.mutate(
      { reviewId: id, action: "approve" },
      {
        onSuccess: () => toast.success("Reply approved and sent!"),
        onError: (err) => toast.error(err.message || "Failed to approve"),
      }
    );
  };

  const handleReject = (id: string | number) => {
    reviewAction.mutate(
      { reviewId: id, action: "reject" },
      {
        onSuccess: () => toast.info("Reply rejected."),
        onError: (err) => toast.error(err.message || "Failed to reject"),
      }
    );
  };

  const renderReviewCard = (review: Review, i: number, showActions = true) => {
    const statusInfo = statusConfig[review.status] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;
    const avatar = review.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const dateStr = review.createdAt
      ? new Date(review.createdAt).toLocaleDateString()
      : "";

    return (
      <motion.div
        key={review.id}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: i * 0.05 }}
        className="glass rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex flex-col gap-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 shrink-0">
                {avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{review.customer}</span>
                  <Badge className={`text-[10px] px-2 py-0.5 ${platformColors[review.platform] || "bg-muted"} border-0 font-medium`}>
                    {review.platform}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 gap-1 ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted/40"}`}
                      />
                    ))}
                  </div>
                  {dateStr && <span className="text-[11px] text-muted-foreground">{dateStr}</span>}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-foreground">View on platform</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground">Copy reply</DropdownMenuItem>
                <DropdownMenuItem className="text-foreground">Regenerate reply</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Review text */}
          <p className="text-sm text-foreground/80 leading-relaxed pl-0 sm:pl-[52px]">
            "{review.review}"
          </p>

          {/* AI Reply */}
          <div className="pl-0 sm:pl-[52px]">
            <div className="rounded-xl bg-primary/[0.04] border border-primary/10 p-3 sm:p-4 relative">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">AI-Generated Reply</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{review.aiReply}</p>

              {showActions && review.status === "pending" && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-primary/10">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                    disabled={reviewAction.isPending}
                    className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 h-8 gap-1.5 rounded-lg text-xs font-medium flex-1 sm:flex-none"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(review.id)}
                    disabled={reviewAction.isPending}
                    className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 h-8 gap-1.5 rounded-lg text-xs font-medium flex-1 sm:flex-none"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-lg text-xs font-medium flex-1 sm:flex-none">
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <CreditsExhaustedDialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground">Manage and respond to customer reviews across all platforms.</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Reviews"}
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reviews", value: stats.total, icon: MessageSquare, accent: "text-primary" },
            { label: "Pending Reply", value: stats.pending, icon: Clock, accent: "text-amber-500" },
            { label: "Approved", value: stats.approved, icon: CheckCircle2, accent: "text-emerald-500" },
            { label: "Avg. Rating", value: stats.avgRating, icon: Star, accent: "text-yellow-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-4 group hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs: Reviews / History */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-border/50 rounded-xl p-1">
          <TabsTrigger value="reviews" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="w-3.5 h-3.5" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-4 space-y-4">
          {/* Filters bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-3 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center"
          >
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 bg-muted/30 border-border/60 text-foreground placeholder:text-muted-foreground h-9 rounded-xl"
            />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[calc(50%-4px)] sm:w-36 bg-muted/30 border-border/60 text-foreground h-9 rounded-xl">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {timeRanges.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[calc(50%-4px)] sm:w-36 bg-muted/30 border-border/60 text-foreground h-9 rounded-xl">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Yelp">Yelp</SelectItem>
                <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                <SelectItem value="App Store">App Store</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32 bg-muted/30 border-border/60 text-foreground h-9 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Review cards */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="glass rounded-2xl p-12 text-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">Failed to load reviews</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {filtered.map((review, i) => renderReviewCard(review, i, true))}
              </div>
            </AnimatePresence>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">No reviews found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4">
          {historyReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">No history yet</p>
              <p className="text-sm text-muted-foreground mt-1">Approved and rejected reviews will appear here</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {historyReviews.map((review, i) => renderReviewCard(review, i, false))}
              </div>
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
