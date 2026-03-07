import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Edit, Filter, Loader2, MessageSquare, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsExhaustedDialog } from "@/components/CreditsExhaustedDialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { getPendingReviews, getAnalyticsReviews, approveReview, rejectReview, generateReply, Review } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-primary/10 text-primary border-primary/20",
  approved: "bg-secondary/10 text-secondary border-secondary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [platformFilter, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: { platform?: string; status?: string } = {};
      if (platformFilter !== "all") params.platform = platformFilter;
      if (statusFilter !== "all") params.status = statusFilter;
      
      const response = statusFilter === 'pending' 
        ? await getPendingReviews(params)
        : await getAnalyticsReviews(params);
      
      if (response.success) {
        setReviews(response.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      setError(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      await approveReview(reviewId);
      setReviews(prev => 
        prev.map(r => r._id === reviewId ? { ...r, status: 'approved' as const } : r)
      );
      toast({
        title: "Review Approved",
        description: "The reply has been approved and published.",
      });
    } catch (err: any) {
      console.error("Failed to approve review:", err);
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: err.message || "Could not approve this review.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      await rejectReview(reviewId);
      setReviews(prev => 
        prev.map(r => r._id === reviewId ? { ...r, status: 'rejected' as const } : r)
      );
      toast({
        title: "Review Rejected",
        description: "The review reply has been rejected.",
      });
    } catch (err: any) {
      console.error("Failed to reject review:", err);
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: err.message || "Could not reject this review.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateReply = async (reviewId: string, reviewText: string) => {
    setActionLoading(`generate-${reviewId}`);
    try {
      const response = await generateReply(reviewText);
      if (response.success && response.reply) {
        setReviews(prev => 
          prev.map(r => r._id === reviewId ? { ...r, aiReply: response.reply } : r)
        );
        toast({
          title: "Reply Generated",
          description: "A new AI reply was generated for this review.",
        });
      }
    } catch (err: any) {
      console.error("Failed to generate reply:", err);
      if (err.message && err.message.toLowerCase().includes("credit")) {
         setCreditsDialogOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: err.message || "Could not generate reply for this review.",
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (platformFilter !== "all" && r.platform !== platformFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground">Manage and respond to customer reviews.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-36 bg-muted/30 border-border text-foreground h-9">
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
          <SelectTrigger className="w-32 bg-muted/30 border-border text-foreground h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reviews found.</p>
          <p className="text-sm text-muted-foreground mt-1">Connect a platform to start receiving reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{review.customerName}</span>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">{review.platform}</Badge>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className={`text-xs ${j < review.rating ? "text-yellow-400" : "text-muted"}`}>★</span>
                      ))}
                    </div>
                    <Badge className={`text-xs ${statusColors[review.status] || statusColors.pending}`}>{review.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">"{review.reviewText}"</p>
                  {review.aiReply ? (
                    <div className="glass rounded-lg p-3 mt-2 relative">
                      <p className="text-xs text-muted-foreground/60 mb-1">AI Reply:</p>
                      <p className="text-sm text-foreground pr-8">{review.aiReply}</p>
                      
                      {review.status === "pending" && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => handleGenerateReply(review._id, review.reviewText)}
                          disabled={actionLoading === `generate-${review._id}`}
                          title="Regenerate format"
                        >
                          {actionLoading === `generate-${review._id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7 gap-1.5"
                        onClick={() => handleGenerateReply(review._id, review.reviewText)}
                        disabled={actionLoading === `generate-${review._id}`}
                      >
                        {actionLoading === `generate-${review._id}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        Generate API Reply
                      </Button>
                    </div>
                  )}
                </div>
                {review.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      size="sm" 
                      className="bg-secondary/10 text-secondary hover:bg-secondary/20 h-8 gap-1.5"
                      onClick={() => handleApprove(review._id)}
                      disabled={actionLoading === review._id || !review.aiReply}
                    >
                      {actionLoading === review._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span className="sr-only sm:not-sr-only sm:inline">Approve</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20 h-8 gap-1.5"
                      onClick={() => handleReject(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="sr-only sm:not-sr-only sm:inline">Reject</span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreditsExhaustedDialog
        open={creditsDialogOpen}
        onOpenChange={setCreditsDialogOpen}
        currentPlan="Free"
      />
    </div>
  );
};

export default Reviews;
