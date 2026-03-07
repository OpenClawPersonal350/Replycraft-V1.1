import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getGoogleConnections, connectGoogle, disconnectGoogle } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle, FaYelp, FaTripadvisor, FaApple, FaGooglePlay } from "react-icons/fa";

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  connectionId?: string;
}

const defaultIntegrations: Integration[] = [
  { id: "google", name: "Google Reviews", description: "Monitor and reply to Google Business reviews.", connected: false },
  { id: "yelp", name: "Yelp", description: "Track and respond to Yelp reviews automatically.", connected: false },
  { id: "tripadvisor", name: "TripAdvisor", description: "Manage TripAdvisor reviews from one dashboard.", connected: false },
  { id: "appstore", name: "App Store", description: "Reply to iOS app reviews with AI assistance.", connected: false },
  { id: "playstore", name: "Play Store", description: "Monitor and reply to Android app reviews.", connected: false },
];

const Integrations = () => {
  const [integrationsList, setIntegrationsList] = useState<Integration[]>(defaultIntegrations);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const response = await getGoogleConnections();
      
      // Merge retrieved connections with default list specifically targeting Google for now
      if (response.success && response.connections) {
        setIntegrationsList(prev => prev.map(integration => {
          if (integration.id === "google") {
            const googleConnection = response.connections.find((c: any) => c.platform === "google");
            if (googleConnection) {
              return { ...integration, connected: true, connectionId: googleConnection._id || googleConnection.id };
            }
          }
          return integration;
        }));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching connections",
        description: error.message || "Failed to load active integrations",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (integrationId: string) => {
    if (integrationId !== "google") {
      toast({
        title: "Coming soon",
        description: `${integrationId} integration is not available yet.`,
      });
      return;
    }

    try {
      setActionLoading(integrationId);
      const response = await connectGoogle();
      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message || "Failed to connect to Google",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    if (!integration.connectionId) return;

    try {
      setActionLoading(integration.id);
      const response = await disconnectGoogle(integration.connectionId);
      if (response.success) {
        setIntegrationsList(prev => prev.map(int => 
          int.id === integration.id ? { ...int, connected: false, connectionId: undefined } : int
        ));
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${integration.name}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Disconnection failed",
        description: error.message || `Failed to disconnect from ${integration.name}`,
      });
    } finally {
      setActionLoading(null);
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
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your review platforms.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrationsList.map((integration, i) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="glass rounded-xl p-5 relative"
          >
            {integration.id === "google" ? (
               <div className="w-10 h-10 rounded-lg bg-[#DB4437]/10 flex items-center justify-center mb-3">
                 <FaGoogle className="w-5 h-5 text-[#DB4437]" />
               </div>
            ) : integration.id === "yelp" ? (
               <div className="w-10 h-10 rounded-lg bg-[#D32323]/10 flex items-center justify-center mb-3">
                 <FaYelp className="w-5 h-5 text-[#D32323]" />
               </div>
            ) : integration.id === "tripadvisor" ? (
               <div className="w-10 h-10 rounded-lg bg-[#000000]/10 flex items-center justify-center mb-3">
                 <FaTripadvisor className="w-5 h-5 text-[#000000] dark:text-white" />
               </div>
            ) : integration.id === "appstore" ? (
               <div className="w-10 h-10 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-3">
                 <FaApple className="w-6 h-6 text-black dark:text-white" />
               </div>
            ) : integration.id === "playstore" ? (
               <div className="w-10 h-10 rounded-lg bg-[#414141]/10 flex items-center justify-center mb-3">
                 <FaGooglePlay className="w-5 h-5 text-[#414141] dark:text-white" />
               </div>
            ) : (
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-lg font-bold text-primary">
                 {integration.name[0]}
               </div>
            )}
            
            <h3 className="font-semibold text-foreground mb-1">{integration.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{integration.description}</p>
            
            <Button
              size="sm"
              disabled={actionLoading === integration.id}
              onClick={() => integration.connected ? handleDisconnect(integration) : handleConnect(integration.id)}
              className={
                integration.connected
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "gradient-primary text-primary-foreground hover:opacity-90"
              }
            >
              {actionLoading === integration.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {integration.connected ? "Disconnect" : "Connect"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
