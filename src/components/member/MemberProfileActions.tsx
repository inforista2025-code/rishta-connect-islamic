import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Heart, Loader2 } from "lucide-react";
import { useMemberApi } from "@/hooks/useMemberApi";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  profileId: number;
  initialSaved?: boolean;
  initialInterested?: boolean;
  compact?: boolean;
  onChanged?: () => void;
}

export function MemberProfileActions({ profileId, initialSaved, initialInterested, compact, onChanged }: Props) {
  const { member } = useMemberAuth();
  const { call } = useMemberApi();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(!!initialSaved);
  const [interested, setInterested] = useState(!!initialInterested);
  const [loading, setLoading] = useState<"save" | "interest" | null>(null);

  useEffect(() => setSaved(!!initialSaved), [initialSaved]);
  useEffect(() => setInterested(!!initialInterested), [initialInterested]);

  const requireLogin = () => {
    if (!member) {
      toast({ title: "Login required", description: "Please log in as a member." });
      navigate("/member/login");
      return true;
    }
    return false;
  };

  const toggleSave = async () => {
    if (requireLogin()) return;
    setLoading("save");
    try {
      await call(saved ? "unsave_profile" : "save_profile", { target_id: profileId });
      setSaved(!saved);
      toast({ title: saved ? "Removed from saved" : "Saved" });
      onChanged?.();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setLoading(null); }
  };

  const sendInterest = async () => {
    if (requireLogin()) return;
    setLoading("interest");
    try {
      const res = await call("send_interest", { target_id: profileId });
      if (res?.error === "limit_reached") {
        toast({ title: "Free limit reached", description: res.message, variant: "destructive" });
        navigate("/pricing");
      } else {
        setInterested(true);
        toast({ title: "Interest sent" });
        onChanged?.();
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setLoading(null); }
  };

  return (
    <div className={`flex gap-2 ${compact ? "" : "w-full"}`}>
      <Button
        type="button"
        variant={saved ? "default" : "outline"}
        size={compact ? "sm" : "default"}
        className="flex-1"
        onClick={toggleSave}
        disabled={loading !== null}
      >
        {loading === "save" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />}
        <span className="ml-1">{saved ? "Saved" : "Save"}</span>
      </Button>
      <Button
        type="button"
        variant={interested ? "default" : "outline"}
        size={compact ? "sm" : "default"}
        className="flex-1"
        onClick={sendInterest}
        disabled={loading !== null || interested}
      >
        {loading === "interest" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${interested ? "fill-current text-red-500" : ""}`} />}
        <span className="ml-1">{interested ? "Sent" : "Interest"}</span>
      </Button>
    </div>
  );
}