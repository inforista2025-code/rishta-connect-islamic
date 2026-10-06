import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useMemberApi } from "@/hooks/useMemberApi";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Lock, Crown, LogOut, Star, Heart, Send, Inbox, ClipboardList,
  UserCheck, ShieldCheck, Edit3, LayoutDashboard, Search, Eye, MessageSquare,
  Activity, Settings, Menu, BookmarkPlus, BadgeCheck, ChevronRight, Lightbulb,
  QrCode, Sparkles
} from "lucide-react";
import { Check } from "lucide-react";
import { PremiumUpgradeCard } from "./PremiumUpgradeCard";
import { ProfilePhoto } from "./ProfilePhoto";
import { ProfilePictureDialog } from "./ProfilePictureDialog";
import { ViewProfileDialog } from "./ViewProfileDialog";
import { DirectPaymentModal } from "@/components/payment/DirectPaymentModal";
import { cn } from "@/lib/utils";
import { calculateAge } from "@/lib/ageCalculator";

type SectionKey =
  | "dashboard" | "profile" | "recommended" | "saved"
  | "received" | "sent" | "viewers"
  | "settings" | "requests" | "browse";

// Trimmed to matrimony-essential sections only.
// Removed: Search Profiles (duplicates public /profiles), Messages (not built),
// Recently Viewed (still surfaced as a dashboard widget), My Activity (redundant with Dashboard).
const NAV: { key: SectionKey; label: string; icon: any }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: UserCheck },
  { key: "browse", label: "Browse All Profiles", icon: Search },
  { key: "recommended", label: "Matches For You", icon: Heart },
  { key: "received", label: "Received Interests", icon: Inbox },
  { key: "sent", label: "Sent Interests", icon: Send },
  { key: "viewers", label: "Who Viewed Me", icon: BadgeCheck },
  { key: "saved", label: "Shortlisted", icon: Star },
  { key: "requests", label: "Update Requests", icon: ClipboardList },
  { key: "settings", label: "Account Settings", icon: Settings },
];

const LOCKED_FIELDS = [
  { key: "full_name", label: "Full Name" },
  { key: "gender", label: "Gender" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "marital_status", label: "Marital Status" },
  { key: "whatsapp_number", label: "WhatsApp Number" },
  { key: "location", label: "Location" },
  { key: "education", label: "Education" },
  { key: "occupation", label: "Occupation" },
  { key: "caste", label: "Caste" },
  { key: "maslak", label: "Maslak" },
  { key: "family", label: "Family Details" },
];

const EDITABLE_FIELDS: { key: string; label: string; long?: boolean }[] = [
  { key: "about_me", label: "About Me / Bio", long: true },
  { key: "personal_introduction", label: "Personal Introduction", long: true },
  { key: "partner_preferences", label: "Partner Preferences", long: true },
  { key: "preferred_age_range", label: "Preferred Age Range" },
  { key: "preferred_location", label: "Preferred Location" },
  { key: "hobbies", label: "Hobbies" },
  { key: "additional_info", label: "Additional Information", long: true },
];

function lockedValue(profile: any, key: string) {
  switch (key) {
    case "full_name": return profile?.name;
    case "occupation": return profile?.profession;
    case "family": return profile?.family;
    default: return profile?.[key];
  }
}

function matchPercent(self: any, other: any): number {
  let score = 70;
  const sLoc = (self?.location || "").toLowerCase();
  const oLoc = (other?.location || "").toLowerCase();
  if (sLoc && oLoc && (sLoc.includes(oLoc.split(",")[0]) || oLoc.includes(sLoc.split(",")[0]))) score += 10;
  if (self?.education && other?.education && self.education === other.education) score += 6;
  if (self?.maslak && other?.maslak && self.maslak === other.maslak) score += 8;
  if (self?.marital_status && other?.marital_status && self.marital_status === other.marital_status) score += 4;
  const seed = (other?.id || 0) % 7;
  score += seed;
  return Math.min(99, score);
}

function relativeTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const days = Math.floor(h / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function MemberDashboardHome() {
  const { member, logout, loading } = useMemberAuth();
  const { call } = useMemberApi();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [section, setSection] = useState<SectionKey>("dashboard");
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [viewTarget, setViewTarget] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [dpOpen, setDpOpen] = useState(false);

  // Single Profile Unlock Payment modal state
  const [unlockTargetProfile, setUnlockTargetProfile] = useState<any | null>(null);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const handleUnlockCandidate = useCallback((p: any) => {
    setUnlockTargetProfile(p);
    setUnlockModalOpen(true);
  }, []);

  // section-specific lazy data
  const [savedList, setSavedList] = useState<any[]>([]);
  const [recentlyList, setRecentlyList] = useState<any[]>([]);
  const [viewersList, setViewersList] = useState<any>({ viewers: [], locked: false, total: 0 });
  const [sentList, setSentList] = useState<any[]>([]);
  const [receivedList, setReceivedList] = useState<any[]>([]);
  const [recList, setRecList] = useState<any[]>([]);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [browseList, setBrowseList] = useState<any[]>([]);
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({});
  const [sectionError, setSectionError] = useState<Record<string, string | null>>({});

  // request dialog
  const [reqOpen, setReqOpen] = useState(false);
  const [reqField, setReqField] = useState<{ key: string; label: string } | null>(null);
  const [reqValue, setReqValue] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [savingEditable, setSavingEditable] = useState(false);

  const loadSummary = useCallback(async () => {
    setBusy(true);
    try {
      const res = await call("dashboard_summary");
      setData(res);
    } catch (e: any) {
      toast({ title: "Failed to load dashboard", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  }, [call, toast]);

  useEffect(() => { if (member) loadSummary(); }, [member, loadSummary]);

  // Load section data on demand
  const loadSection = useCallback(async (s: SectionKey) => {
    setSectionLoading((m) => ({ ...m, [s]: true }));
    setSectionError((m) => ({ ...m, [s]: null }));
    try {
      if (s === "saved") setSavedList((await call("list_saved")).saved || []);
      else if (s === "viewers") setViewersList(await call("list_who_viewed_me"));
      else if (s === "sent") setSentList((await call("list_interests", { direction: "sent" })).interests || []);
      else if (s === "received") setReceivedList((await call("list_interests", { direction: "received" })).interests || []);
      else if (s === "recommended") setRecList((await call("recommendations")).recommendations || []);
      else if (s === "requests") setRequestsList((await call("list_my_update_requests")).requests || []);
      else if (s === "browse") setBrowseList((await call("browse_all")).profiles || []);
    } catch (e: any) {
      setSectionError((m) => ({ ...m, [s]: e.message || "Failed to load" }));
    } finally {
      setSectionLoading((m) => ({ ...m, [s]: false }));
    }
  }, [call]);

  useEffect(() => {
    if (!member) return;
    if (["saved", "viewers", "sent", "received", "recommended", "requests", "browse"].includes(section)) {
      loadSection(section);
    }
  }, [section, member, loadSection]);

  const profile = data?.profile;
  const isPremium = !!data?.is_premium;
  const completion = data?.completion || { percent: 0, missing: [] };
  const counts = data?.counts || {};

  const handleLogout = async () => { await logout(); navigate("/member/login"); };

  const openView = async (id: number) => {
    setViewTarget(id);
    setViewOpen(true);
    try { await call("record_view", { target_id: id }); } catch {}
  };

  const handleSave = async (id: number, currentlySaved: boolean) => {
    try {
      await call(currentlySaved ? "unsave_profile" : "save_profile", { target_id: id });
      toast({ title: currentlySaved ? "Removed" : "Saved" });
      loadSummary();
      if (section === "saved") setSavedList((await call("list_saved")).saved || []);
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const openRequest = (f: { key: string; label: string }) => {
    setReqField(f); setReqValue(""); setReqReason(""); setReqOpen(true);
  };

  const submitRequest = async () => {
    if (!reqField || !reqValue.trim()) {
      toast({ title: "Requested value is required", variant: "destructive" }); return;
    }
    try {
      await call("request_update", {
        field_name: reqField.key,
        current_value: String(lockedValue(profile, reqField.key) ?? ""),
        requested_value: reqValue.trim(),
        reason: reqReason.trim(),
      });
      toast({ title: "Update request submitted", description: "Admin will review shortly." });
      setReqOpen(false);
      setRequestsList((await call("list_my_update_requests")).requests || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const saveEditable = async (values: Record<string, string>) => {
    setSavingEditable(true);
    try {
      await call("update_editable", { values });
      setData((d: any) => ({ ...d, editable: { ...d.editable, ...values } }));
      toast({ title: "Saved" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setSavingEditable(false); }
  };

  const savedIds = useMemo(() => new Set<number>(savedList.map((p) => p.id)), [savedList]);

  if (loading || !member) return null;

  const SidebarBody = (
    <DashboardSidebar
      member={member}
      profile={profile}
      completion={completion}
      section={section}
      onSelect={(s) => { setSection(s); setMobileOpen(false); }}
      counts={counts}
      onCompleteNow={() => { setSection("profile"); setMobileOpen(false); }}
      onLogout={handleLogout}
      onPhotoClick={() => { setDpOpen(true); setMobileOpen(false); }}
    />
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[1400px]">
        {/* Mobile bar */}
        <div className="lg:hidden mb-3 flex items-center justify-between">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm"><Menu className="w-4 h-4 mr-2" />Menu</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">{SidebarBody}</SheetContent>
          </Sheet>
          <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-purple-600" : ""}>
            {isPremium ? "Premium" : "Free Member"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_300px] gap-4">
          {/* Left sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">{SidebarBody}</div>
          </aside>

          {/* Center */}
          <main className="space-y-4 min-w-0">
            {busy && !data ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <>
                {section === "dashboard" && (
                  <DashboardContent
                    data={data}
                    member={member}
                    isPremium={isPremium}
                    onViewProfile={openView}
                    onSave={handleSave}
                    onUnlock={handleUnlockCandidate}
                    savedIds={savedIds}
                    onSeeAllRecommended={() => setSection("browse")}
                  />
                )}
                {section === "profile" && (
                  <ProfileSection
                    profile={profile}
                    member={member}
                    editable={data?.editable || {}}
                    onRequestUpdate={openRequest}
                    onSaveEditable={saveEditable}
                    savingEditable={savingEditable}
                  />
                )}
                {section === "recommended" && (
                  <CardListSection
                    title="Recommended For You"
                    profiles={recList}
                    onView={openView}
                    onSave={handleSave}
                    onUnlock={handleUnlockCandidate}
                    savedIds={savedIds}
                    self={profile}
                    isPremium={isPremium}
                    loading={!!sectionLoading.recommended}
                    error={sectionError.recommended}
                    onRetry={() => loadSection("recommended")}
                    emptyMsg="No recommendations found based on current criteria."
                  />
                )}
                {section === "browse" && (
                  <>
                    {!isPremium && (
                      <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-3 text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                          <Crown className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            You are browsing as a Free member. Photos are blurred and contact details are hidden.
                            Upgrade to Premium to unlock full profiles and unlimited access.
                          </span>
                        </CardContent>
                      </Card>
                    )}
                    <CardListSection
                      title={`All ${profile?.gender ? (profile.gender === "Male" ? "Bride Profiles (Dulhan Proposals)" : "Groom Profiles (Dulha Proposals)") : "Opposite Gender Profiles"}`}
                      profiles={browseList}
                      onView={openView}
                      onSave={handleSave}
                      onUnlock={handleUnlockCandidate}
                      savedIds={savedIds}
                      self={profile}
                      isPremium={isPremium}
                      loading={!!sectionLoading.browse}
                      error={sectionError.browse}
                      onRetry={() => loadSection("browse")}
                      emptyMsg="No verified profiles available right now."
                    />
                  </>
                )}
                {section === "saved" && (
                  <CardListSection
                    title="Saved Profiles"
                    profiles={savedList}
                    onView={openView}
                    onSave={handleSave}
                    onUnlock={handleUnlockCandidate}
                    savedIds={savedIds}
                    self={profile}
                    isPremium={isPremium}
                    emptyMsg="No saved profiles yet."
                    loading={!!sectionLoading.saved}
                    error={sectionError.saved}
                    onRetry={() => loadSection("saved")}
                  />
                )}
                {section === "viewers" && (
                  <ViewersSection
                    data={viewersList}
                    isPremium={isPremium}
                    onView={openView}
                    onSave={handleSave}
                    onUnlock={handleUnlockCandidate}
                    savedIds={savedIds}
                    self={profile}
                    loading={!!sectionLoading.viewers}
                    error={sectionError.viewers}
                    onRetry={() => loadSection("viewers")}
                  />
                )}
                {section === "sent" && (
                  <InterestsSection title="Sent Interests" rows={sentList} emptyMsg="No interests sent yet." onView={openView}
                    loading={!!sectionLoading.sent} error={sectionError.sent} onRetry={() => loadSection("sent")} />
                )}
                {section === "received" && (
                  <InterestsSection title="Received Interests" rows={receivedList} emptyMsg="No interests received yet." onView={openView}
                    loading={!!sectionLoading.received} error={sectionError.received} onRetry={() => loadSection("received")} />
                )}
                {section === "settings" && (
                  <SettingsSection member={member} onLogout={handleLogout} />
                )}
                {section === "requests" && (
                  <RequestsSection requests={requestsList} />
                )}
              </>
            )}
          </main>

          {/* Right rail */}
          <aside className="space-y-4 min-w-0">
            {!isPremium && <PremiumUpgradeCard />}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm">Profile Tips</h4>
                </div>
                <p className="text-xs text-muted-foreground">Complete your profile and add more photos to get better matches.</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span>{completion.percent}% Complete</span></div>
                  <Progress value={completion.percent} className="h-1.5" />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setSection("profile")}>
                  Improve Profile
                </Button>
              </CardContent>
            </Card>

            <WhoViewedPreview
              viewers={data?.who_viewed_me || []}
              total={counts?.who_viewed_me || 0}
              isPremium={isPremium}
              onSeeAll={() => setSection("viewers")}
            />
          </aside>
        </div>
      </div>

      <ViewProfileDialog open={viewOpen} onOpenChange={setViewOpen} targetId={viewTarget} />

      <ProfilePictureDialog
        open={dpOpen}
        onOpenChange={setDpOpen}
        photos={profile?.photo_urls || []}
        onUpdated={(urls) => {
          setData((d: any) => (d ? { ...d, profile: { ...d.profile, photo_urls: urls } } : d));
          loadSummary();
        }}
      />

      <Dialog open={reqOpen} onOpenChange={setReqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request profile update</DialogTitle>
            <DialogDescription>{reqField?.label} change request. Admin approval is required before changes are applied.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Current value</Label>
              <Input value={profile ? String(lockedValue(profile, reqField?.key || "") ?? "") : ""} disabled />
            </div>
            <div>
              <Label>Requested value</Label>
              <Input value={reqValue} onChange={(e) => setReqValue(e.target.value)} placeholder="New value" />
            </div>
            <div>
              <Label>Reason (optional)</Label>
              <Textarea value={reqReason} onChange={(e) => setReqReason(e.target.value)} placeholder="Why are you requesting this change?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReqOpen(false)}>Cancel</Button>
            <Button onClick={submitRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DirectPaymentModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        defaultPlan="single"
        hidePlanSwitcher={true}
        profileCode={unlockTargetProfile ? `RM-${unlockTargetProfile.gender === "Female" ? "BR" : "GR"}-${unlockTargetProfile.order ?? unlockTargetProfile.id}` : ""}
        profileName={unlockTargetProfile?.name}
        memberPhone={member?.whatsapp_number}
        targetProfileId={unlockTargetProfile?.id}
      />
    </div>
  );
}

/* ===================== SIDEBAR ===================== */
function DashboardSidebar({ member, profile, completion, section, onSelect, counts, onCompleteNow, onLogout, onPhotoClick }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPhotoClick}
              className="rounded-full ring-2 ring-transparent hover:ring-primary/40 transition shrink-0"
              aria-label="Change profile picture"
              title="Change profile picture"
            >
              <ProfilePhoto src={profile?.photo_urls?.[0]} alt={member.full_name} size="md" rounded="full" />
            </button>
            <div className="min-w-0">
              <div className="font-semibold truncate">{member.full_name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                Verified Member <BadgeCheck className="w-3 h-3 text-green-600" />
              </div>
            </div>
          </div>
          <nav className="space-y-0.5">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = section === n.key;
              const badge =
                n.key === "saved" ? counts.saved :
                n.key === "viewers" ? counts.who_viewed_me : null;
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => onSelect(n.key)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition",
                    active ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-muted-foreground")} />
                    {n.label}
                  </span>
                  {n.key === "viewers" && counts.who_viewed_me === 0 && (
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">New</Badge>
                  )}
                  {badge ? <Badge variant="secondary" className="text-[10px] py-0 px-1.5">{badge}</Badge> : null}
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Profile Completion</span>
            <span className="text-sm font-bold text-primary">{completion.percent}%</span>
          </div>
          <Progress value={completion.percent} className="h-2" />
          <p className="text-xs text-muted-foreground">Complete your profile to get better matches</p>
          <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10" onClick={onCompleteNow}>
            Complete Now
          </Button>
        </CardContent>
      </Card>

      <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground" onClick={onLogout}>
        <LogOut className="w-4 h-4 mr-2" /> Logout
      </Button>
    </div>
  );
}

/* ===================== DASHBOARD CONTENT ===================== */
function DashboardContent({ data, member, isPremium, onViewProfile, onSave, onUnlock, savedIds, onSeeAllRecommended }: any) {
  const counts = data?.counts || {};
  const recommendations = data?.recommendations || [];
  const newWeek = data?.new_this_week || [];
  const recently = data?.recently_viewed || [];
  const self = data?.profile;
  return (
    <div className="space-y-4">
      {/* Greeting */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100">
        <CardContent className="p-5">
          <h2 className="text-xl sm:text-2xl font-bold">Assalamualaikum, {member.full_name}! 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Your profile is {data?.completion?.percent || 0}% complete.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <StatTile icon={<ShieldCheck className="w-5 h-5 text-green-600" />} bg="bg-green-100" label="Profile Status" value={<span className="text-green-700">Verified</span>} />
            <StatTile icon={<Star className="w-5 h-5 text-pink-600" />} bg="bg-pink-100" label="Saved Profiles" value={counts.saved ?? 0} />
            <StatTile icon={<Eye className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" label="Recently Viewed" value={counts.recently_viewed ?? 0} />
            <StatTile
              icon={<BookmarkPlus className="w-5 h-5 text-rose-600" />} bg="bg-rose-100"
              label="Free Requests Left"
              value={isPremium ? "∞" : `${counts.free_requests_left ?? 0} / ${counts.free_requests_limit ?? 5}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommended */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 flex-wrap gap-2">
          <CardTitle className="text-lg">Recommended For You</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary/50 hover:bg-primary/10 font-bold text-xs rounded-xl shadow-2xs gap-1 cursor-pointer"
            onClick={onSeeAllRecommended}
          >
            <span>
              {(self?.gender || member?.gender || "").toLowerCase() === "male"
                ? "View All Bride Profiles (Dulhan) →"
                : (self?.gender || member?.gender || "").toLowerCase() === "female"
                ? "View All Groom Profiles (Dulha) →"
                : "View All Opposite Proposals →"}
            </span>
          </Button>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recommendations yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {recommendations.slice(0, 4).map((p: any) => (
                <RecommendedCard
                  key={p.id} p={p}
                  match={matchPercent(self, p)}
                  onView={() => onViewProfile(p.id)}
                  onSave={() => onSave(p.id, savedIds.has(p.id))}
                  onUnlock={onUnlock}
                  saved={savedIds.has(p.id)}
                  isPremium={isPremium}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">New Profiles This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {newWeek.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No new profiles yet.</p>}
            {newWeek.slice(0, 5).map((p: any) => (
              <MiniRow key={p.id} p={p} badge={<Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">New</Badge>} onClick={() => onViewProfile(p.id)} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recently Viewed Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recently.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nothing viewed yet.</p>}
            {recently.slice(0, 5).map((p: any) => (
              <MiniRow key={p.id} p={p} time={relativeTime(p.viewed_at)} onClick={() => onViewProfile(p.id)} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({ icon, bg, label, value }: any) {
  return (
    <div className="bg-white dark:bg-card rounded-xl p-3 flex items-center gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs", bg)}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
        <div className="font-semibold text-sm truncate">{value}</div>
      </div>
    </div>
  );
}

function RecommendedCard({ p, match, onView, onSave, saved, onUnlock, isPremium }: any) {
  const isUnlocked = Boolean(p.is_unlocked);
  return (
    <div className="group border rounded-xl overflow-hidden bg-card hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-out flex flex-col">
      <button
        type="button"
        onClick={onView}
        className="relative block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden"
        aria-label={`View ${p.name}'s profile`}
      >
        <div className="group-hover:scale-105 transition-transform duration-500 ease-out">
          <ProfilePhoto src={p.photo_urls?.[0]} alt={p.name} blurred={p.photo_blurred} size="full" rounded="md" className="aspect-square rounded-none" showLockHint />
        </div>
        <span className="absolute bottom-2 left-2">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] shadow-xs">{match}% Match</Badge>
        </span>
        {isUnlocked && !isPremium && (
          <span className="absolute top-2 right-2">
            <Badge className="bg-emerald-600 text-white text-[10px] shadow-xs font-bold">Unlocked ✅</Badge>
          </span>
        )}
      </button>
      <button type="button" onClick={onView} className="p-2.5 space-y-1 text-left focus:outline-none flex-1">
        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors duration-200">{p.name}</div>
        <div className="text-[11px] text-muted-foreground truncate">{calculateAge(p.dob || p.date_of_birth, p.age)} yrs · {p.location || "—"}</div>
        <div className="text-[11px] text-muted-foreground truncate">{p.education || "—"}</div>
        <div className="text-[11px] text-muted-foreground truncate">{p.profession || "—"}</div>
      </button>

      <div className="p-2.5 pt-0 space-y-1.5">
        <div className="flex gap-1.5">
          <Button size="sm" className="h-8 text-[11px] px-2 flex-1 font-semibold" onClick={onView}>
            <Heart className="w-3.5 h-3.5 mr-1" /> Interest
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 shrink-0 active:scale-[0.95] transition-all duration-150"
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            aria-label={saved ? "Remove from shortlist" : "Add to shortlist"}
          >
            <Star className={cn("w-3.5 h-3.5", saved ? "fill-primary text-primary" : "")} />
          </Button>
        </div>

        {isUnlocked ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-[11px] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold gap-1 rounded-lg shadow-2xs cursor-pointer"
            onClick={onView}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unlocked (View Contact)</span>
          </Button>
        ) : onUnlock && !isPremium ? (
          <Button
            size="sm"
            className="w-full h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 rounded-lg shadow-2xs cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onUnlock(p); }}
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Unlock Contact (₹48)</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function MiniRow({ p, badge, time, onClick }: any) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md text-left">
      <ProfilePhoto src={p.photo_urls?.[0]} alt={p.name} blurred={p.photo_blurred} size="md" rounded="full" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{p.name}</div>
        <div className="text-[11px] text-muted-foreground truncate">{p.age || "—"} · {p.location || "—"}</div>
      </div>
      {badge || (time && <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>)}
    </button>
  );
}

/* ===================== OTHER SECTIONS ===================== */
function CardListSection({ title, profiles, onView, onSave, onUnlock, savedIds, self, isPremium, emptyMsg, loading, error, onRetry }: any) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading profiles…</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">{emptyMsg || "Nothing here yet."}</p>
            {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Refresh</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {profiles.map((p: any) => (
              <RecommendedCard
                key={p.id} p={p}
                match={matchPercent(self, p)}
                onView={() => onView(p.id)}
                onSave={() => onSave(p.id, savedIds.has(p.id))}
                onUnlock={onUnlock}
                saved={savedIds.has(p.id)}
                isPremium={isPremium}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ViewersSection({ data, isPremium, onView, onSave, onUnlock, savedIds, self, loading, error, onRetry }: any) {
  const viewers = data?.viewers || [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who Viewed Me</CardTitle>
        <CardDescription>
          {isPremium ? "All members who viewed your profile." : `Showing latest 4 viewers. Upgrade to see all ${data?.total || 0}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-14"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
          </div>
        ) : viewers.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No one has viewed your profile yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {viewers.map((p: any) => (
              <RecommendedCard
                key={p.id} p={p}
                match={matchPercent(self, p)}
                onView={() => onView(p.id)}
                onSave={() => onSave(p.id, savedIds.has(p.id))}
                onUnlock={onUnlock}
                saved={savedIds.has(p.id)}
                isPremium={isPremium}
              />
            ))}
          </div>
        )}
        {!isPremium && data?.locked && (
          <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900">
            <Crown className="w-4 h-4 inline mr-1" />Upgrade to Premium to see everyone who viewed your profile.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InterestsSection({ title, rows, emptyMsg, onView, loading, error, onRetry }: any) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-14"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">{emptyMsg}</p>
        ) : rows.map((r: any) => r.profile && (
          <button key={r.id} type="button" onClick={() => onView(r.profile.id)} className="w-full flex items-center gap-3 p-3 border rounded-md hover:bg-muted/50 text-left min-h-[64px]">
            <ProfilePhoto src={r.profile.photo_urls?.[0]} alt={r.profile.name} blurred={r.profile.photo_blurred} size="md" rounded="full" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{r.profile.name}</div>
              <div className="text-xs text-muted-foreground truncate">{calculateAge(r.profile.dob || r.profile.date_of_birth, r.profile.age)} yrs · {r.profile.location}</div>
            </div>
            <Badge variant="secondary" className="text-[10px]">{r.status}</Badge>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function ActivitySection({ counts, recently, viewers }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>My Activity</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile icon={<Star className="w-5 h-5 text-pink-600" />} bg="bg-pink-100" label="Saved" value={counts.saved ?? 0} />
          <StatTile icon={<Eye className="w-5 h-5 text-amber-600" />} bg="bg-amber-100" label="Profiles Viewed" value={counts.recently_viewed ?? 0} />
          <StatTile icon={<BadgeCheck className="w-5 h-5 text-green-600" />} bg="bg-green-100" label="Viewers" value={counts.who_viewed_me ?? 0} />
          <StatTile icon={<Heart className="w-5 h-5 text-rose-600" />} bg="bg-rose-100" label="Free Left" value={counts.free_requests_left ?? "∞"} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Latest Profile Views</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recently.slice(0, 8).map((p: any) => <MiniRow key={p.id} p={p} time={relativeTime(p.viewed_at)} onClick={() => {}} />)}
          {recently.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsSection({ member, onLogout }: any) {
  return (
    <Card>
      <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Name</span><span className="font-medium">{member.full_name}</span></div>
        <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Email</span><span className="font-medium">{member.email}</span></div>
        <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">WhatsApp</span><span className="font-medium">{member.whatsapp_number || "—"}</span></div>
        <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Plan</span><span className="font-medium">{member.plan_type === "premium" ? "Premium" : "Free"}</span></div>
        <p className="text-xs text-muted-foreground pt-2">To update verified information, request changes from the My Profile tab.</p>
        <Button variant="outline" onClick={onLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
      </CardContent>
    </Card>
  );
}

function RequestsSection({ requests }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Update Requests</CardTitle>
        <CardDescription>Your pending and processed requests to change verified information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No update requests yet.</p>
        ) : requests.map((r: any) => (
          <div key={r.id} className="border rounded-md p-3">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="font-medium">{r.field_name}</span>
              <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge>
            </div>
            <div className="text-sm space-y-1">
              <div><span className="text-muted-foreground">Current:</span> {r.current_value || "—"}</div>
              <div><span className="text-muted-foreground">Requested:</span> {r.requested_value}</div>
              {r.reason && <div><span className="text-muted-foreground">Reason:</span> {r.reason}</div>}
              {r.admin_notes && <div><span className="text-muted-foreground">Admin notes:</span> {r.admin_notes}</div>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PlaceholderSection({ title, description, cta, onCta }: any) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button onClick={onCta}>{cta}</Button>
      </CardContent>
    </Card>
  );
}

/* ===================== PROFILE / EDIT ===================== */
function ProfileSection({ profile, member, editable, onRequestUpdate, onSaveEditable, savingEditable }: any) {
  const [directPaymentOpen, setDirectPaymentOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"single" | "premium">("premium");

  const prefix = profile?.gender === "Female" ? "RM-BR" : "RM-GR";
  const numPart = profile?.order !== undefined && profile?.order !== null ? profile.order : profile?.id;
  const profileCode = profile ? `${prefix}-${numPart}` : "";

  return (
    <div className="space-y-4">
      {/* Membership & Payment Center Card */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-lg font-black text-foreground">
                Membership Payment & Upgrade Center
              </CardTitle>
            </div>
            <Badge className={member?.plan_type === "premium" ? "bg-purple-600 text-white font-bold" : "bg-emerald-600 text-white font-bold"}>
              {member?.plan_type === "premium" ? "⭐ Active Premium Member" : "Free Member Account"}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Directly pay via Barcode / UPI (8789428096@upi) or send prefilled WhatsApp verification receipt to Admin with your profile details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50/80 via-card to-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-foreground">Upgrade to Premium</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Unlock all verified profiles & direct contact numbers across the website
              </p>
            </div>

            <ul className="space-y-2 text-xs text-left max-w-xs mx-auto">
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>View full verified contact details</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Send unlimited profile interests</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>View unblurred HD profile photos</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Get featured on 1st Page pinned top</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>⭐ Premium Gold Verified Badge</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-foreground">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Priority 1-on-1 customer support</span>
              </li>
            </ul>

            <div className="rounded-2xl border border-amber-500/40 bg-background/90 py-3 px-4 text-center shadow-xs">
              <span className="text-3xl font-black text-primary">₹491</span>
              <span className="text-xs font-bold text-muted-foreground"> / 2 Months Access</span>
            </div>

            <Button
              onClick={() => { setPaymentPlan("premium"); setDirectPaymentOpen(true); }}
              size="lg"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-xl shadow-md gap-2 cursor-pointer"
            >
              <QrCode className="w-5 h-5 text-amber-300" />
              <span>Pay Direct via Barcode / UPI</span>
            </Button>

            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Direct On-Screen UPI Payment (8789428096@upi)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" />Verified Information</CardTitle>
          <CardDescription>These fields are verified by admin. Submit a request to change any value.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {LOCKED_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-3 border-b pb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{String(lockedValue(profile, f.key) ?? "—")}</span>
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onRequestUpdate(f)}>Request Update</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <EditableForm initial={editable} onSave={onSaveEditable} saving={savingEditable} />

      <DirectPaymentModal
        isOpen={directPaymentOpen}
        onClose={() => setDirectPaymentOpen(false)}
        defaultPlan={paymentPlan}
        hidePlanSwitcher={true}
        profileCode={profileCode}
        profileName={member?.full_name || profile?.name}
        memberPhone={member?.whatsapp_number}
      />
    </div>
  );
}

function EditableForm({ initial, onSave, saving }: { initial: any; onSave: (v: Record<string, string>) => void; saving: boolean }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    EDITABLE_FIELDS.forEach((f) => (o[f.key] = initial?.[f.key] ?? ""));
    return o;
  });
  useEffect(() => {
    const o: Record<string, string> = {};
    EDITABLE_FIELDS.forEach((f) => (o[f.key] = initial?.[f.key] ?? ""));
    setValues(o);
  }, [initial]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Edit3 className="w-5 h-5" /> About You</CardTitle>
        <CardDescription>Update these freely — changes save instantly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {EDITABLE_FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.long
              ? <Textarea rows={3} value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
              : <Input value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />}
          </div>
        ))}
        <Button onClick={() => onSave(values)} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

/* ===================== WHO VIEWED ME PREVIEW ===================== */
function WhoViewedPreview({ viewers, total, isPremium, onSeeAll }: any) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Who Viewed Me</h4>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={onSeeAll}>View All</Button>
        </div>
        {viewers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No viewers yet.</p>
        ) : (
          <div className="flex -space-x-2">
            {viewers.slice(0, 4).map((v: any) => (
              <ProfilePhoto key={v.id} src={v.photo_urls?.[0]} alt={v.name} blurred={v.photo_blurred} size="md" rounded="full" className="border-2 border-background" />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{total} {total === 1 ? "person" : "people"} viewed your profile</p>
        <Button variant="outline" size="sm" className="w-full text-primary border-primary/40" onClick={onSeeAll}>
          {isPremium ? "See All Viewers" : "See Who Viewed"}
        </Button>
      </CardContent>
    </Card>
  );
}