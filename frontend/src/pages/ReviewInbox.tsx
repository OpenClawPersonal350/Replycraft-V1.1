import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Star, MessageSquare, Send, Check, X, Edit3, 
  RefreshCw, Sparkles, Filter, ChevronLeft, ChevronRight,
  ThumbsUp, ThumbsDown, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Review {
  _id: string;
  platform: string;
  reviewText: string;
  rating: number;
  author: string;
  sentiment: string;
  aiReply: string;
  replyText: string;
  replyStatus: string;
  createdAt: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  google: 'bg-blue-100 text-blue-700',
  yelp: 'bg-red-100 text-red-700',
  tripadvisor: 'bg-green-100 text-green-700',
  appstore: 'bg-purple-100 text-purple-700',
  playstore: 'bg-green-100 text-green-700',
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'bg-green-100 text-green-700',
  neutral: 'bg-yellow-100 text-yellow-700',
  negative: 'bg-red-100 text-red-700',
  unknown: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  posted: 'Posted',
  rejected: 'Rejected',
  failed: 'Failed',
};

const ReviewInbox = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  // Edit modal state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editReply, setEditReply] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [filter, platformFilter, pagination.page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      if (filter !== 'all') params.status = filter;
      if (platformFilter !== 'all') params.platform = platformFilter;
      
      const response = await apiService.getReviews(params);
      
      if (response.success) {
        setReviews(response.reviews || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load reviews",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      setSending(reviewId);
      const response = await apiService.approveReview(reviewId);
      
      if (response.success) {
        toast({ title: "Reply approved" });
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to approve",
        description: error.message
      });
    } finally {
      setSending(null);
    }
  };

  const handleSend = async (reviewId: string) => {
    try {
      setSending(reviewId);
      const response = await apiService.sendReviewReply(reviewId);
      
      if (response.success) {
        toast({ title: "Reply sent successfully!" });
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send reply",
        description: error.message
      });
    } finally {
      setSending(null);
    }
  };

  const handleGenerate = async (reviewId: string) => {
    try {
      setSending(reviewId);
      const response = await apiService.generateReviewReply(reviewId);
      
      if (response.success) {
        toast({ title: "AI reply generation started" });
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to generate reply",
        description: error.message
      });
    } finally {
      setSending(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      setSending(reviewId);
      const response = await apiService.rejectReview(reviewId);
      
      if (response.success) {
        toast({ title: "Review rejected" });
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to reject",
        description: error.message
      });
    } finally {
      setSending(null);
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditReply(review.replyText || review.aiReply || "");
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    
    try {
      setSending(editingReview._id);
      const response = await apiService.updateReviewReply(editingReview._id, editReply);
      
      if (response.success) {
        toast({ title: "Reply updated" });
        setEditingReview(null);
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update reply",
        description: error.message
      });
    } finally {
      setSending(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Review Inbox</h1>
            <p className="text-muted-foreground">Manage and respond to customer reviews</p>
          </div>
          
          <Button variant="outline" onClick={fetchReviews} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="yelp">Yelp</SelectItem>
              <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
              <SelectItem value="appstore">App Store</SelectItem>
              <SelectItem value="playstore">Play Store</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Review List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews found</p>
              <p className="text-sm text-muted-foreground">Connect your accounts to start receiving reviews</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {review.author?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{review.author || "Anonymous"}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge className={PLATFORM_COLORS[review.platform] || 'bg-gray-100'}>
                              {review.platform}
                            </Badge>
                            {renderStars(review.rating)}
                            <Badge className={SENTIMENT_COLORS[review.sentiment] || 'bg-gray-100'}>
                              {getSentimentIcon(review.sentiment)}
                              <span className="ml-1">{review.sentiment}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="bg-muted/50 rounded-lg p-3 mb-3">
                      <p className="text-sm">{review.reviewText}</p>
                    </div>

                    {/* AI Reply Section */}
                    {(review.aiReply || review.replyText) && (
                      <div className="border rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">AI Reply</span>
                          <Badge variant="outline" className="ml-auto">
                            {STATUS_LABELS[review.replyStatus] || review.replyStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.replyText || review.aiReply}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!review.aiReply && review.replyStatus === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerate(review._id)}
                          disabled={sending === review._id}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Generate Reply
                        </Button>
                      )}
                      
                      {(review.aiReply || review.replyText) && review.replyStatus === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApprove(review._id)}
                            disabled={sending === review._id}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditModal(review)}
                            disabled={sending === review._id}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleSend(review._id)}
                            disabled={sending === review._id}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleReject(review._id)}
                            disabled={sending === review._id}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {review.replyStatus === 'approved' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleSend(review._id)}
                          disabled={sending === review._id}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send Now
                        </Button>
                      )}
                      
                      {review.replyStatus === 'posted' && (
                        <Badge className="bg-green-100 text-green-700">
                          <Check className="w-3 h-3 mr-1" />
                          Posted
                        </Badge>
                      )}
                      
                      {sending === review._id && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-lg p-6 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold mb-4">Edit Reply</h2>
              <Textarea
                value={editReply}
                onChange={(e) => setEditReply(e.target.value)}
                rows={6}
                className="mb-4"
                placeholder="Enter your reply..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingReview(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={sending === editingReview._id}>
                  Save Reply
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewInbox;
