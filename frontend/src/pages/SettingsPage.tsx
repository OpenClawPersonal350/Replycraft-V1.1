import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, Upload, User, Mail, Phone, Building, Globe, Sparkles, Plus, Pencil, Trash2, Star, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getProfile, updateProfile, getUser, apiService } from "@/lib/api";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/useAuth";

// Countries list
const COUNTRIES = [
  { code: 'US', name: 'United States', phoneLength: 10 },
  { code: 'GB', name: 'United Kingdom', phoneLength: 10 },
  { code: 'IN', name: 'India', phoneLength: 10 },
  { code: 'CA', name: 'Canada', phoneLength: 10 },
  { code: 'AU', name: 'Australia', phoneLength: 9 },
  { code: 'DE', name: 'Germany', phoneLength: 10 },
  { code: 'FR', name: 'France', phoneLength: 9 },
  { code: 'JP', name: 'Japan', phoneLength: 10 },
  { code: 'BR', name: 'Brazil', phoneLength: 11 },
  { code: 'MX', name: 'Mexico', phoneLength: 10 },
];

// Common timezones
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
];

// Brand tones
const BRAND_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
];

// Reply modes
const REPLY_MODES = [
  { value: 'manual', label: 'Manual - Review before sending' },
  { value: 'auto', label: 'Auto - Send immediately' },
];

interface AIConfig {
  _id: string;
  configName: string;
  businessName: string;
  brandTone: string;
  emojiAllowed: boolean;
  replyMode: string;
  replyDelayMinutes: number;
  isDefault: boolean;
}

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  
  // User Profile Section
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [businessName, setBusinessName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // AI Configurations
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [configsLoading, setConfigsLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);
  
  // Config form
  const [configName, setConfigName] = useState("");
  const [configBusinessName, setConfigBusinessName] = useState("");
  const [configBrandTone, setConfigBrandTone] = useState("professional");
  const [configEmojiAllowed, setConfigEmojiAllowed] = useState(true);
  const [configReplyMode, setConfigReplyMode] = useState("manual");
  const [configReplyDelay, setConfigReplyDelay] = useState("0");

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (cropImageSrc && cropImageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(cropImageSrc);
      }
    };
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchAIConfigs();
    
    const handleProfileUpdate = () => {
      const updatedUser = getUser();
      if (updatedUser) {
        setAvatarUrl(updatedUser.avatarUrl || "");
      }
    };
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('user_profile_updated', handleProfileUpdate);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProfile();
      
      if (response.success) {
        if (response.name !== undefined) setName(response.name);
        if (response.email !== undefined) setEmail(response.email);
        if (response.phoneNumber !== undefined) setPhoneNumber(response.phoneNumber || "");
        if (response.businessName !== undefined) setBusinessName(response.businessName || "");
        if (response.timezone !== undefined) setTimezone(response.timezone || "UTC");
        if (response.avatarUrl !== undefined) setAvatarUrl(response.avatarUrl);
      }
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIConfigs = async () => {
    try {
      setConfigsLoading(true);
      const response = await apiService.getAIConfigurations();
      if (response.success) {
        setConfigs(response.configurations || []);
      }
    } catch (err: any) {
      console.error("Failed to fetch AI configs:", err);
    } finally {
      setConfigsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile({
        name,
        phoneNumber: phoneNumber || null,
        businessName: businessName || null,
        timezone,
      });

      if (response.success) {
        setSuccess("Settings saved successfully!");
        
        const currentUser = getUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, name, avatarUrl };
          localStorage.setItem('replycraft_user', JSON.stringify(updatedUser));
        }
        
        await refreshUser();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setCropImageSrc(imageUrl);
    if (e.target) e.target.value = '';
  };

  const handleCropCancel = () => {
    if (cropImageSrc && cropImageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(cropImageSrc);
    }
    setCropImageSrc(null);
    setSelectedFile(null);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      if (cropImageSrc && cropImageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(cropImageSrc);
      }
      setCropImageSrc(null);
      setSelectedFile(null);
      
      const response = await apiService.uploadAvatar(croppedBlob);
      
      if (response.success && response.fullAvatarUrl) {
        setAvatarUrl(response.fullAvatarUrl);
        toast({ title: "Avatar updated successfully" });
        
        const currentUser = getUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, avatarUrl: response.fullAvatarUrl };
          localStorage.setItem('replycraft_user', JSON.stringify(updatedUser));
        }
        
        await refreshUser();
        window.dispatchEvent(new Event('user_profile_updated'));
      } else {
        toast({ variant: "destructive", title: "Failed to upload avatar" });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to upload avatar", description: err.message });
    }
  };

  // AI Config handlers
  const openConfigModal = (config?: AIConfig) => {
    if (config) {
      setEditingConfig(config);
      setConfigName(config.configName);
      setConfigBusinessName(config.businessName || '');
      setConfigBrandTone(config.brandTone);
      setConfigEmojiAllowed(config.emojiAllowed);
      setConfigReplyMode(config.replyMode);
      setConfigReplyDelay(config.replyDelayMinutes?.toString() || '0');
    } else {
      setEditingConfig(null);
      setConfigName('');
      setConfigName('');
      setConfigBusinessName('');
      setConfigBrandTone('professional');
      setConfigEmojiAllowed(true);
      setConfigReplyMode('manual');
      setConfigReplyDelay('0');
    }
    setShowConfigModal(true);
  };

  const handleSaveConfig = async () => {
    try {
      const configData = {
        configName,
        businessName: configBusinessName,
        brandTone: configBrandTone,
        emojiAllowed: configEmojiAllowed,
        replyMode: configReplyMode,
        replyDelayMinutes: parseInt(configReplyDelay) || 0,
      };

      let response;
      if (editingConfig) {
        response = await apiService.updateAIConfiguration(editingConfig._id, configData);
      } else {
        response = await apiService.createAIConfiguration(configData);
      }

      if (response.success) {
        toast({ title: editingConfig ? 'Configuration updated' : 'Configuration created' });
        setShowConfigModal(false);
        fetchAIConfigs();
      } else {
        toast({ variant: "destructive", title: response.error || 'Failed to save configuration' });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || 'Failed to save configuration' });
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    
    try {
      const response = await apiService.deleteAIConfiguration(id);
      if (response.success) {
        toast({ title: 'Configuration deleted' });
        fetchAIConfigs();
      } else {
        toast({ variant: "destructive", title: response.error || 'Failed to delete' });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || 'Failed to delete' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await apiService.setDefaultAIConfiguration(id);
      if (response.success) {
        toast({ title: 'Default configuration set' });
        fetchAIConfigs();
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || 'Failed to set default' });
    }
  };

  const getAvatarUrl = () => {
    if (!avatarUrl) return undefined;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${avatarUrl}`;
  };

  const currentUser = { name, avatarUrl: getAvatarUrl(), email };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your profile and AI reply configurations</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
            {success}
          </div>
        )}

        {/* SECTION 1: User Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <UserAvatar user={currentUser} className="w-24 h-24" />
              <div>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Phone with Country */}
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.code} ({c.name})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Phone number"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="grid gap-2">
              <Label>Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name" />
            </div>

            {/* Timezone */}
            <div className="grid gap-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: AI Reply Profiles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Reply Profiles
              </CardTitle>
              <CardDescription>Create multiple AI configurations for different use cases</CardDescription>
            </div>
            <Button onClick={() => openConfigModal()} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          </CardHeader>
          <CardContent>
            {configsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : configs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No AI profiles yet</p>
                <p className="text-sm">Create your first profile to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map(config => (
                  <div key={config._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{config.configName}</span>
                          {config.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {config.businessName || 'No business name'} • {config.brandTone} • {config.replyMode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!config.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(config._id)} title="Set as default">
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openConfigModal(config)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteConfig(config._id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving} className="gradient-primary">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
          </Button>
        </div>
      </motion.div>

      {/* Image Cropper Modal */}
      {cropImageSrc && (
        <ImageCropper src={cropImageSrc} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
      )}

      {/* AI Config Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingConfig ? 'Edit Profile' : 'New AI Profile'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Profile Name</Label>
              <Input value={configName} onChange={(e) => setConfigName(e.target.value)} placeholder="e.g., Default, Luxury Brand" />
            </div>
            
            <div className="grid gap-2">
              <Label>Business Name</Label>
              <Input value={configBusinessName} onChange={(e) => setConfigBusinessName(e.target.value)} placeholder="Your business name" />
            </div>

            <div className="grid gap-2">
              <Label>Brand Tone</Label>
              <Select value={configBrandTone} onValueChange={setConfigBrandTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BRAND_TONES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Reply Mode</Label>
              <Select value={configReplyMode} onValueChange={setConfigReplyMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REPLY_MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Allow Emojis</Label>
              <Switch checked={configEmojiAllowed} onCheckedChange={setConfigEmojiAllowed} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>Cancel</Button>
            <Button onClick={handleSaveConfig} disabled={!configName.trim()}>
              {editingConfig ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
