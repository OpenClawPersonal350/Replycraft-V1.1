import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile, getUser, apiService } from "@/lib/api";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [restaurantName, setRestaurantName] = useState("");
  const [brandTone, setBrandTone] = useState("professional");
  const [emojiAllowed, setEmojiAllowed] = useState(false);
  const [replyMode, setReplyMode] = useState("manual");
  const [replyDelayMinutes, setReplyDelayMinutes] = useState("60");

  useEffect(() => {
    fetchProfile();
    const user = getUser();
    if (user) {
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
    }

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
        if (response.avatarUrl !== undefined) setAvatarUrl(response.avatarUrl);

        if (response.profile) {
          const profile = response.profile;
          setRestaurantName(profile.restaurantName || "");
          setBrandTone(profile.brandTone || "professional");
          setEmojiAllowed(profile.emojiAllowed || false);
          setReplyMode(profile.replyMode || "manual");
          setReplyDelayMinutes(profile.replyDelayMinutes?.toString() || "60");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile({
        name,
        restaurantName,
        brandTone: brandTone as "casual" | "professional" | "friendly",
        emojiAllowed,
        replyMode: replyMode as "auto" | "manual",
        replyDelayMinutes: parseInt(replyDelayMinutes) || 0,
      });

      if (response.success) {
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.profile || "Failed to save settings");
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
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setCropImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
    // reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setCropImageSrc(null);
      await apiService.uploadAvatar(croppedBlob);
      toast({ title: "Avatar updated successfully" });
      await fetchProfile(); // Synchronize with backend to ensure proper propagation
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed to upload avatar", description: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your business preferences.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
          {success}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-4 border-b border-border">
          <UserAvatar user={{ name: name, avatarUrl }} className="w-20 h-20 text-2xl" />
          <div className="space-y-3">
            <div>
              <Label className="text-foreground">Profile Picture</Label>
              <p className="text-xs text-muted-foreground mb-2">Upload a picture to personalize your account</p>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {cropImageSrc && (
          <ImageCropper 
             imageSrc={cropImageSrc} 
             onClose={() => setCropImageSrc(null)}
             onCropComplete={handleCropComplete}
          />
        )}

        <div className="space-y-2 pt-2">
          <Label className="text-foreground">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="pl-10 bg-muted/30 border-border text-foreground" 
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-foreground">Restaurant Name</Label>
          <Input 
            value={restaurantName} 
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Enter your restaurant name"
            className="bg-muted/30 border-border text-foreground" 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Brand Tone</Label>
          <Select value={brandTone} onValueChange={setBrandTone}>
            <SelectTrigger className="bg-muted/30 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground">Use Emojis</Label>
            <p className="text-xs text-muted-foreground">Include emojis in AI replies</p>
          </div>
          <Switch 
            checked={emojiAllowed} 
            onCheckedChange={setEmojiAllowed} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Reply Mode</Label>
          <Select value={replyMode} onValueChange={setReplyMode}>
            <SelectTrigger className="bg-muted/30 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="auto">Automatic</SelectItem>
              <SelectItem value="manual">Manual Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Reply Delay</Label>
          <Select value={replyDelayMinutes} onValueChange={setReplyDelayMinutes}>
            <SelectTrigger className="bg-muted/30 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="0">Instant</SelectItem>
              <SelectItem value="60">1 Hour</SelectItem>
              <SelectItem value="360">6 Hours</SelectItem>
              <SelectItem value="1440">24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="gradient-primary text-primary-foreground hover:opacity-90"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
