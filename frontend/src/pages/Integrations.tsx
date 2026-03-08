import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, ExternalLink, Check, AlertCircle, RefreshCw, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  platform: string;
  locationName: string;
  locationId: string;
  connectedAt: string;
  status: string;
}

const PLATFORM_CONFIG = {
  google: {
    name: 'Google Business',
    icon: '🔍',
    color: 'bg-blue-100 text-blue-700',
    description: 'Connect your Google Business Profile to automatically fetch and respond to reviews.'
  },
  yelp: {
    name: 'Yelp',
    icon: '🍽️',
    color: 'bg-red-100 text-red-700',
    description: 'Connect your Yelp business page to manage reviews.'
  },
  tripadvisor: {
    name: 'TripAdvisor',
    icon: '✈️',
    color: 'bg-green-100 text-green-700',
    description: 'Connect TripAdvisor to reach more travelers.'
  }
};

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getIntegrations();
      if (response.success) {
        setIntegrations(response.integrations || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load integrations",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      // Get OAuth URL from backend
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-client-id';
      const redirectUri = `${window.location.origin}/api/integrations/google/callback`;
      
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=https://www.googleapis.com/auth/business.manage` +
        `&access_type=offline` +
        `&prompt=consent`;
      
      // For demo purposes, simulate a connection
      // In production, this would redirect to Google OAuth
      toast({
        title: "Google OAuth",
        description: "Redirecting to Google for authorization..."
      });
      
      // Simulate successful connection for demo
      setTimeout(() => {
        const mockIntegration: Integration = {
          id: `google_${Date.now()}`,
          platform: 'google',
          locationName: 'Demo Restaurant',
          locationId: 'demo_location_123',
          connectedAt: new Date().toISOString(),
          status: 'active'
        };
        
        setIntegrations([...integrations, mockIntegration]);
        toast({ title: "Google Business connected!" });
        setConnecting(false);
      }, 1500);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error.message
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;
    
    try {
      setDisconnecting(id);
      const response = await apiService.disconnectIntegration(id);
      
      if (response.success) {
        setIntegrations(integrations.filter(i => i.id !== id));
        toast({ title: "Integration disconnected" });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to disconnect",
        description: error.message
      });
    } finally {
      setDisconnecting(null);
    }
  };

  const isConnected = (platform: string) => {
    return integrations.some(i => i.platform === platform && i.status === 'active');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect your business accounts to start receiving reviews</p>
        </div>

        {/* Google Business */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                  🔍
                </div>
                <div>
                  <CardTitle>Google Business Profile</CardTitle>
                  <CardDescription>
                    {PLATFORM_CONFIG.google.description}
                  </CardDescription>
                </div>
              </div>
              {isConnected('google') ? (
                <Badge className="bg-green-100 text-green-700">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not connected</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : isConnected('google') ? (
              <div className="space-y-4">
                {integrations.filter(i => i.platform === 'google').map(integration => (
                  <div 
                    key={integration.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{integration.locationName}</p>
                        <p className="text-sm text-muted-foreground">
                          Connected {new Date(integration.connectedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                      disabled={disconnecting === integration.id}
                    >
                      {disconnecting === integration.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Location
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Google Business
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="opacity-75">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-2xl">
                  🍽️
                </div>
                <div>
                  <CardTitle>Yelp</CardTitle>
                  <CardDescription>{PLATFORM_CONFIG.yelp.description}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="mt-4 opacity-75">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                  ✈️
                </div>
                <div>
                  <CardTitle>TripAdvisor</CardTitle>
                  <CardDescription>{PLATFORM_CONFIG.tripadvisor.description}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Need help connecting?</p>
              <p className="text-sm text-blue-700 mt-1">
                Make sure you have admin access to your Google Business Profile. 
                You'll be redirected to Google to authorize access.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Integrations;
