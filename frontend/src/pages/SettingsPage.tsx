import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, User, Bell, Bot, MapPin, Phone, Mail, Shield, CalendarDays, Eye, EyeOff, Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import ImageCropper from "@/components/ImageCropper";
import { countries, type Country } from "@/data/countries";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useUpdateProfile, useUploadAvatar, useSettings, useUpdateSettings, useUpdateNotifications, useChangePassword } from "@/api/hooks";

const SettingsPage = () => {
  const { user, setAvatarUrl } = useUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("123 Main Street");
  const [city, setCity] = useState("Mumbai");
  const [dob, setDob] = useState<Date | undefined>();
  const [dobOpen, setDobOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // AI Settings state
  const [brandTone, setBrandTone] = useState("professional");
  const [useEmojis, setUseEmojis] = useState(false);
  const [replyMode, setReplyMode] = useState("approval");
  const [replyDelay, setReplyDelay] = useState("1h");
  const [replyLanguage, setReplyLanguage] = useState("english");

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [negativeAlerts, setNegativeAlerts] = useState(true);

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Password validation rules (same as signup)
  const securityPasswordRules = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "One symbol (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];
  const securityRuleResults = useMemo(() => securityPasswordRules.map((r) => r.test(newPassword)), [newPassword]);
  const securityAllRulesPassed = securityRuleResults.every(Boolean);
  const securityPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAvatarUrl(url);
    setCropSrc(null);
    toast({ title: "Photo updated", description: "Your profile picture has been changed." });
    // Upload via API
    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");
    try {
      // TODO: Uncomment when backend connected
      // await uploadAvatarMutation.mutateAsync(formData);
    } catch { /* handled by mutation */ }
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= selectedCountry.maxDigits) {
      setPhone(digits);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Uncomment when backend connected
      // await updateProfileMutation.mutateAsync({
      //   fullName, phone, countryCode: selectedCountry.code,
      //   address, city, dateOfBirth: dob?.toISOString(),
      // });
      toast({ title: "Profile saved", description: "Your profile has been updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save profile.", variant: "destructive" });
    }
  };

  const handleSaveAI = async () => {
    try {
      // TODO: Uncomment when backend connected
      // await updateSettingsMutation.mutateAsync({ brandTone, replyLanguage, useEmojis, replyMode, replyDelay });
      toast({ title: "AI settings saved", description: "Reply preferences updated." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save settings.", variant: "destructive" });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // TODO: Uncomment when backend connected
      // await updateNotificationsMutation.mutateAsync({ emailNotifications, negativeAlerts });
      toast({ title: "Notification settings saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to save.", variant: "destructive" });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "New password and confirm password must be the same.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    try {
      // TODO: Uncomment when backend connected
      // await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to change password.", variant: "destructive" });
    }
  };

  const sectionAnim = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto lg:mx-0 mx-auto lg:mx-0">
      {cropSrc && (
        <ImageCropper imageSrc={cropSrc} onCropComplete={handleCropComplete} onCancel={() => setCropSrc(null)} />
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass w-full justify-start gap-1 p-1 h-auto flex-wrap">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <User className="w-3.5 h-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Bot className="w-3.5 h-3.5" /> AI Replies
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-3.5 h-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-3.5 h-3.5" /> Security
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <motion.div {...sectionAnim} className="gla4 sm:p-6 space-y-5 sm: rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileRef.current?.click()}>
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors bg-muted/50 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-background">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground truncate">{fullName || "Your Name"}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {user.plan} Plan
                </span>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-2">
              <Label className="text-foreground">Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-muted/30 border-border text-foreground"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" /> Date of Birth
              </Label>
              <Popover open={dobOpen} onOpenChange={setDobOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-muted/30 border-border text-foreground"
                  >
                    {dob ? format(dob, "PPP") : <span className="text-muted-foreground">Select your date of birth</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={(date) => {
                      setDob(date);
                      setDobOpen(false);
                    }}
                    fromYear={1920}
                    toYear={new Date().getFullYear() - 13}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </Label>
              <div className="flex gap-2">
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[130px] justify-start gap-2 bg-muted/30 border-border text-foreground shrink-0"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-mono">{selectedCountry.dialCode}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0 bg-card border-border" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((c) => (
                            <CommandItem
                              key={c.code}
                              value={`${c.name} ${c.dialCode}`}
                              onSelect={() => {
                                setSelectedCountry(c);
                                setPhone("");
                                setCountryOpen(false);
                              }}
                            >
                              <span className="text-lg mr-2">{c.flag}</span>
                              <span className="flex-1">{c.name}</span>
                              <span className="text-muted-foreground font-mono text-sm">{c.dialCode}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={`${"0".repeat(selectedCountry.maxDigits)}`}
                  maxLength={selectedCountry.maxDigits}
                  inputMode="numeric"
                  className="bg-muted/30 border-border text-foreground font-mono flex-1"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selectedCountry.name} • {selectedCountry.maxDigits} digits
              </p>
            </div>

            {/* Address + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="bg-muted/30 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="bg-muted/30 border-border text-foreground"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="gradient-primary text-primary-foreground hover:opacity-90">
              Save Profile
            </Button>
          </motion.div>
        </TabsContent>

        {/* AI REPLIES TAB */}
        <TabsContent value="ai">
          <motion.div {...sectionAnim} className="glass rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-foreground">Brand Tone</Label>
              <Select value={brandTone} onValueChange={setBrandTone}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Reply Language</Label>
              <Select value={replyLanguage} onValueChange={setReplyLanguage}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label className="text-foreground">Use Emojis</Label>
                <p className="text-xs text-muted-foreground">Include emojis in AI replies</p>
              </div>
              <Switch checked={useEmojis} onCheckedChange={setUseEmojis} />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Reply Mode</Label>
              <Select value={replyMode} onValueChange={setReplyMode}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="auto">Automatic</SelectItem>
                  <SelectItem value="approval">Manual Approval</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                {replyMode === "auto" ? "AI replies are sent automatically" : "You'll review and approve each reply"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Reply Delay</Label>
              <Select value={replyDelay} onValueChange={setReplyDelay}>
                <SelectTrigger className="bg-muted/30 border-border text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveAI} className="gradient-primary text-primary-foreground hover:opacity-90">
              Save AI Settings
            </Button>
          </motion.div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <motion.div {...sectionAnim} className="glass rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label className="text-foreground">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Get notified about new reviews</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label className="text-foreground">Negative Review Alerts</Label>
                <p className="text-xs text-muted-foreground">Instant alerts for reviews below 3 stars</p>
              </div>
              <Switch checked={negativeAlerts} onCheckedChange={setNegativeAlerts} />
            </div>

            <Button onClick={handleSaveNotifications} className="gradient-primary text-primary-foreground hover:opacity-90">
              Save Notifications
            </Button>
          </motion.div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <motion.div {...sectionAnim} className="glass rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-foreground">Current Password</Label>
              <div className="relative">
                <Input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 border-border text-foreground pr-10" />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">New Password</Label>
              <div className="relative">
                <Input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 border-border text-foreground pr-10" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live password validation */}
            {newPassword.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-1">
                {securityPasswordRules.map((rule, i) => (
                  <div key={rule.label} className="flex items-center gap-1.5">
                    {securityRuleResults[i] ? (
                      <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-destructive shrink-0" />
                    )}
                    <span className={`text-[11px] ${securityRuleResults[i] ? "text-secondary" : "text-muted-foreground"}`}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-foreground">Confirm New Password</Label>
              <div className="relative">
                <Input type={showConfirmPw ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="bg-muted/30 border-border text-foreground pr-10" />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {confirmPassword.length > 0 && !securityPasswordsMatch && (
              <p className="text-[11px] text-destructive px-1">Passwords do not match</p>
            )}

            <Button
              onClick={handleChangePassword}
              disabled={!securityAllRulesPassed || !securityPasswordsMatch || currentPassword.length === 0}
              className="gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Update Password
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
