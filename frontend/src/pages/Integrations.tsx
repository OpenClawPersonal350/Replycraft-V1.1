import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ExternalLink, Plug, Search, Zap, Shield, ArrowRight, X, RefreshCw, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useIntegrations, useToggleIntegration, useSyncIntegration, useDisconnectIntegration } from "@/api/hooks";
import { IntegrationCardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import type { Integration } from "@/api/types";

const categoryLabels: Record<string, string> = {
  reviews: "Reviews",
  app_store: "App Store",
};

const bgAccents: Record<string, string> = {
  google: "bg-blue-500/5 border-blue-500/10",
  yelp: "bg-red-500/5 border-red-500/10",
  tripadvisor: "bg-green-500/5 border-green-500/10",
  appstore: "bg-sky-500/5 border-sky-500/10",
  googleplay: "bg-emerald-500/5 border-emerald-500/10",
  trustpilot: "bg-green-600/5 border-green-600/10",
};

const categories = ["All", "Reviews", "App Store"];

const Integrations = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  const { data: integrations = [], isLoading, error } = useIntegrations();
  const toggleMutation = useToggleIntegration();
  const syncMutation = useSyncIntegration();
  const disconnectMutation = useDisconnectIntegration();

  const filtered = integrations.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" ||
      categoryLabels[i.category]?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalReviews = integrations.reduce((sum, i) => sum + i.reviewCount, 0);

  const handleConnect = (integration: Integration) => {
    toggleMutation.mutate({ integrationId: integration.id, connect: true });
  };

  const handleDisconnect = (integration: Integration) => {
    disconnectMutation.mutate(integration.id);
  };

  const handleSync = (integration: Integration) => {
    setSyncingIds((prev) => new Set(prev).add(integration.id));
    syncMutation.mutate(
      { integrationId: integration.id },
      {
        onSettled: () => {
          setTimeout(() => {
            setSyncingIds((prev) => {
              const next = new Set(prev);
              next.delete(integration.id);
              return next;
            });
          }, 2000);
        },
      }
    );
  };

  const isSyncing = (id: string) => syncingIds.has(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect your review platforms and manage them in one place.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1.5 self-start">
          <Plug className="w-3.5 h-3.5" />
          {connectedCount} Connected
        </Badge>
      </div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Supercharge your workflow</p>
            <p className="text-xs text-muted-foreground">Connect more platforms to centralize all your reviews</p>
          </div>
        </div>
        <div className="flex gap-6 sm:ml-auto text-center">
          <div>
            <p className="text-xl font-bold text-foreground">{connectedCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{integrations.length - connectedCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{totalReviews.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Reviews</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/30 border-border/60 text-foreground placeholder:text-muted-foreground h-9 rounded-xl"
          />
        </div>
        <div className="flex gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <IntegrationCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="glass rounded-2xl p-12 text-center">
          <Plug className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">Failed to load integrations</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
      )}

      {/* Integration Cards */}
      {!isLoading && !error && (
        <AnimatePresence mode="popLayout">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((integration, i) => {
              const syncing = isSyncing(integration.id);
              const accent = bgAccents[integration.platform] || "bg-muted/5 border-border/10";

              return (
                <motion.div
                  key={integration.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className={`glass rounded-2xl p-5 border ${accent} group transition-all duration-300 hover:shadow-lg relative overflow-hidden`}
                >
                  {/* Syncing overlay */}
                  <AnimatePresence>
                    {syncing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-8 h-8 text-primary" />
                        </motion.div>
                        <p className="text-sm font-medium text-foreground mt-3">Syncing reviews...</p>
                        <motion.div className="w-32 h-1.5 rounded-full bg-muted/30 mt-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Connected indicator */}
                  {integration.connected && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
                    </div>
                  )}

                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl bg-background/80 border border-border/50 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/50 text-muted-foreground">
                      {categoryLabels[integration.category] || integration.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{integration.description}</p>

                  {/* Review count + last sync */}
                  {integration.connected && (
                    <div className="space-y-1 mb-4">
                      {integration.reviewCount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Shield className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            <span className="text-foreground font-medium">{integration.reviewCount.toLocaleString()}</span> reviews synced
                          </span>
                        </div>
                      )}
                      {integration.lastSyncAt && (
                        <p className="text-[10px] text-muted-foreground/60 pl-5">
                          Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {integration.connected ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border/60 text-muted-foreground hover:text-foreground h-8 rounded-lg text-xs gap-1.5 flex-1"
                          onClick={() => handleSync(integration)}
                          disabled={syncing}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                          {syncing ? "Syncing..." : "Sync Now"}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 h-8 rounded-lg text-xs gap-1.5"
                          onClick={() => handleDisconnect(integration)}
                          disabled={disconnectMutation.isPending}
                        >
                          <X className="w-3.5 h-3.5" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="gradient-primary text-primary-foreground hover:opacity-90 h-8 rounded-lg text-xs gap-1.5 w-full group/btn"
                        onClick={() => handleConnect(integration)}
                        disabled={toggleMutation.isPending}
                      >
                        {toggleMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            Connect
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <Plug className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No integrations found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
        </motion.div>
      )}
    </div>
  );
};

export default Integrations;
