import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, MapPin, Calendar, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function QuickSearchFinder() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<string>("Female");
  const [ageRange, setAgeRange] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [maslak, setMaslak] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (gender) params.set("gender", gender);
    if (ageRange && ageRange !== "all") params.set("age", ageRange);
    if (location && location !== "all") params.set("location", location);
    if (maslak && maslak !== "all") params.set("maslak", maslak);

    navigate(`/profiles?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 lg:mt-12 bg-card/95 backdrop-blur-md border border-primary/20 rounded-2xl p-5 md:p-6 shadow-xl relative z-10">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/70">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
            Quick Match Finder <span className="text-xs font-normal text-primary ml-1.5 font-sans bg-primary/10 px-2 py-0.5 rounded-full">100% Verified</span>
          </h3>
          <p className="text-xs text-muted-foreground">Find your ideal life partner by gender, age, location & sect</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
        {/* Looking For */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-primary" /> Looking for
          </label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="h-11 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Female">Bride (दुल्हन / Female)</SelectItem>
              <SelectItem value="Male">Groom (दूल्हा / Male)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Range */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Age Range
          </label>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger className="h-11 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Age (सभी उम्र)</SelectItem>
              <SelectItem value="18-24">18 to 24 Years</SelectItem>
              <SelectItem value="25-30">25 to 30 Years</SelectItem>
              <SelectItem value="31-35">31 to 35 Years</SelectItem>
              <SelectItem value="36-45">36 to 45 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Location / State
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-11 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations (सभी जगह)</SelectItem>
              <SelectItem value="Bihar">Bihar</SelectItem>
              <SelectItem value="Jharkhand">Jharkhand (Ranchi/Dhanbad)</SelectItem>
              <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
              <SelectItem value="Delhi">Delhi NCR</SelectItem>
              <SelectItem value="Mumbai">Mumbai / Maharashtra</SelectItem>
              <SelectItem value="Bengaluru">Bengaluru / Karnataka</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad / Telangana</SelectItem>
              <SelectItem value="Gulf">Gulf & Abroad (Saudi/UAE/Qatar)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Maslak / Sect */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Maslak / Sect
          </label>
          <Select value={maslak} onValueChange={setMaslak}>
            <SelectTrigger className="h-11 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Maslak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Maslak (सभी)</SelectItem>
              <SelectItem value="Sunni">Sunni</SelectItem>
              <SelectItem value="Hanafi">Hanafi</SelectItem>
              <SelectItem value="Deobandi">Deobandi</SelectItem>
              <SelectItem value="Barelvi">Barelvi</SelectItem>
              <SelectItem value="Salafi">Salafi / Ahle Hadees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search CTA */}
        <div>
          <Button
            type="submit"
            className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find Matches
          </Button>
        </div>
      </form>
    </div>
  );
}
