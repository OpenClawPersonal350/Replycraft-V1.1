import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, ArrowRight, MapPin, Phone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { AuthBackground } from "@/components/AuthBackground";
import ImageCropper from "@/components/ImageCropper";
import { countries, type Country } from "@/data/countries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ProfileSetup = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [dobOpen, setDobOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleCropComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAvatarPreview(url);
    setCropSrc(null);
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= selectedCountry.maxDigits) {
      setPhone(digits);
    }
  };

  const handleContinue = () => {
    // TODO: Call profileApi.update with data including dob
    navigate("/onboarding/plan");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4 py-8">
      <AuthBackground />

      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-8 w-full max-w-lg relative z-10 glow-primary"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="text-center mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Step 1 of 2</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">Complete your profile</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Tell us a bit about yourself</p>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-border group-hover:border-primary transition-colors bg-muted/50 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center border-2 border-background">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-foreground">Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
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
                  captionLayout="dropdown-buttons"
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
            <Label className="text-foreground flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</Label>
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
              <Label className="text-foreground flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Address</Label>
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

          <Button
            onClick={handleContinue}
            className="w-full gradient-primary text-primary-foreground hover:opacity-90 btn-glow gap-2 h-11 mt-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
