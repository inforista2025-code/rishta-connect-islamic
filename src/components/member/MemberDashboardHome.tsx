import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useMemberApi } from "@/hooks/useMemberApi";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Crown, Sparkles, LogOut, Star, Heart, Send, Inbox, ClipboardList, UserCheck, ShieldCheck, Edit3 } from "lucide-react";
import { MemberProfileActions } from "./MemberProfileActions";

const LOCKED_FIELDS: { key: string; label: string }[] = [
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
    case "full_name": return profile.name;
    case "occupation": return profile.profession;
    case "family": return profile.family;
    default: return profile[key];
  }
}

function PremiumBadge() {
  return (
    <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
      <Crown className="w-3 h-3 mr-1" /> Premium Verified
    </Badge>
  );
}

function ProfileMiniCard({ p, onChanged, savedSet, sentSet }: { p: any; onChanged?: () => void; savedSet?: Set<number>; sentSet?: Set<number> }) {
  const isPrem = !!p.is_premium;
  return (
    <Card className={isPrem ? "border-purple-300 shadow-[0_0_20px_-8px_rgba(168,85,247,0.5)] bg-gradient-to-br from-purple-50/60 to-pink-50/40" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {p.name}
            {isPrem && <PremiumBadge />}
          </CardTitle>
          <Badge variant="secondary">{p.gender}</Badge>
        </div>
        <CardDescription className="text-xs">
          {p.age && <>🎂 {p.age} yrs · </>}{p.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {p.education && <div><span className="text-muted-foreground">Education:</span> {p.education}</div>}
        {p.profession && <div><span className="text-muted-foreground">Profession:</span> {p.profession}</div>}
        {p.marital_status && <div><span className="text-muted-foreground">Marital:</span> {p.marital_status}</div>}
        <MemberProfileActions
          profileId={p.id}
          compact
          initialSaved={savedSet?.has(p.id)}
          initialInterested={sentSet?.has(p.id)}
          onChanged={onChanged}
        />
      </CardContent>
    </Card>
  );
}

export function MemberDashboardHome() {
  const { member, logout, loading } = useMemberAuth();
  const { call } = useMemberApi();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [editable, setEditable] = useState<any>({});
  const [completion, setCompletion] = useState<{ percent: number; missing: { key: string; label: string; weight: number }[] }>({ percent: 0, missing: [] });
  const [isPremium, setIsPremium] = useState(false);
  const [busy, setBusy] = useState(true);

  const [saved, setSaved] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [received, setReceived] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [updateRequests, setUpdateRequests] = useState<any[]>([]);

  const [reqOpen, setReqOpen] = useState(false);
  const [reqField, setReqField] = useState<{ key: string; label: string } | null>(null);
  const [reqValue, setReqValue] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [savingEditable, setSavingEditable] = useState(false);

  const loadAll = useCallback(async () => {
    setBusy(true);
    try {
      const [p, s, se, re, rec, ur] = await Promise.all([
        call("get_profile"),
        call("list_saved"),
        call("list_interests", { direction: "sent" }),
        call("list_interests", { direction: "received" }),
        call("recommendations"),
        call("list_my_update_requests"),
      ]);
      setProfile(p.profile);
      setEditable(p.editable || {});
      setCompletion(p.completion);
      setIsPremium(p.is_premium);
      setSaved(s.saved || []);
      setSent(se.interests || []);
      setReceived(re.interests || []);
      setRecommended(rec.recommendations || []);
      setUpdateRequests(ur.requests || []);
    } catch (e: any) {
      toast({ title: "Failed to load dashboard", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  }, [call, toast]);

  useEffect(() => { if (member) loadAll(); }, [member, loadAll]);

  if (loading || !member) return null;

  const savedSet = new Set<number>(saved.map((p) => p.id));
  const sentSet = new Set<number>(sent.map((r) => r.profile?.id).filter(Boolean));

  const handleLogout = async () => { await logout(); navigate("/member/login"); };

  const openRequest = (f: { key: string; label: string }) => {
    setReqField(f);
    setReqValue("");
    setReqReason("");
    setReqOpen(true);
  };

  const submitRequest = async () => {
    if (!reqField || !reqValue.trim()) {
      toast({ title: "Requested value is required", variant: "destructive" });
      return;
    }
    try {
      await call("request_update", {
        field_name: reqField.key,
        current_value: profile ? String(lockedValue(profile, reqField.key) ?? "") : "",
        requested_value: reqValue.trim(),
        reason: reqReason.trim(),
      });
      toast({ title: "Update request submitted", description: "Admin will review shortly." });
      setReqOpen(false);
      const ur = await call("list_my_update_requests");
      setUpdateRequests(ur.requests || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const saveEditable = async (values: Record<string, string>) => {
    setSavingEditable(true);
    try {
      await call("update_editable", { values });
      setEditable((prev: any) => ({ ...prev, ...values }));
      toast({ title: "Saved" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setSavingEditable(false); }
  };

  const expiry = member.premium_expiry ? new Date(member.premium_expiry).toLocaleDateString() : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Assalamu Alaikum, {member.full_name}
              {isPremium && <PremiumBadge />}
            </h1>
            <p className="text-muted-foreground mt-1">Your member dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            {isPremium ? (
              <Badge className="bg-purple-600 hover:bg-purple-700">Premium{expiry ? ` · until ${expiry}` : ""}</Badge>
            ) : (
              <Badge variant="secondary">Free Member</Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {busy && !profile ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="overview"><UserCheck className="w-4 h-4 mr-1" />My Profile</TabsTrigger>
              <TabsTrigger value="edit"><Edit3 className="w-4 h-4 mr-1" />Edit Profile</TabsTrigger>
              <TabsTrigger value="saved"><Star className="w-4 h-4 mr-1" />Saved ({saved.length})</TabsTrigger>
              <TabsTrigger value="sent"><Send className="w-4 h-4 mr-1" />Sent ({sent.length})</TabsTrigger>
              <TabsTrigger value="received"><Inbox className="w-4 h-4 mr-1" />Received ({received.length})</TabsTrigger>
              <TabsTrigger value="recommended"><Heart className="w-4 h-4 mr-1" />Recommended</TabsTrigger>
              <TabsTrigger value="requests"><ClipboardList className="w-4 h-4 mr-1" />Update Requests</TabsTrigger>
              {!isPremium && <TabsTrigger value="upgrade"><Crown className="w-4 h-4 mr-1" />Upgrade</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>{completion.percent}% complete</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={completion.percent} className="h-3" />
                  {completion.missing.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Suggestions to improve:</p>
                      <ul className="text-sm space-y-1">
                        {completion.missing.map((m) => (
                          <li key={m.key} className="flex justify-between border-b py-1">
                            <span>Add {m.label}</span>
                            <span className="text-primary font-medium">+{m.weight}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" />Verified Profile</CardTitle>
                  <CardDescription>This is the information visible on your verified profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                  {LOCKED_FIELDS.map((f) => (
                    <div key={f.key} className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-medium text-right">{String(lockedValue(profile, f.key) ?? "—")}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Verified Fields (Locked)</CardTitle>
                  <CardDescription>These were verified by admin. Submit a request to change any value.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LOCKED_FIELDS.map((f) => (
                    <div key={f.key} className="flex items-center justify-between gap-3 border-b pb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{f.label}</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate">{String(lockedValue(profile, f.key) ?? "—")}</span>
                          <Badge variant="outline" className="text-[10px]">Verified</Badge>
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openRequest(f)}>Request Update</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <EditableForm
                initial={editable}
                onSave={saveEditable}
                saving={savingEditable}
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              {saved.length === 0 ? <Empty msg="No saved profiles yet." /> : (
                <div className="grid md:grid-cols-2 gap-4">
                  {saved.map((p) => <ProfileMiniCard key={p.id} p={p} savedSet={savedSet} sentSet={sentSet} onChanged={loadAll} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              {sent.length === 0 ? <Empty msg="You haven't sent any interests yet." /> : (
                <div className="grid md:grid-cols-2 gap-4">
                  {sent.map((r) => r.profile && <ProfileMiniCard key={r.id} p={r.profile} savedSet={savedSet} sentSet={sentSet} onChanged={loadAll} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="received" className="mt-6">
              {received.length === 0 ? <Empty msg="No interests received yet." /> : (
                <div className="grid md:grid-cols-2 gap-4">
                  {received.map((r) => r.profile && <ProfileMiniCard key={r.id} p={r.profile} savedSet={savedSet} sentSet={sentSet} onChanged={loadAll} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              {recommended.length === 0 ? <Empty msg="No recommendations available right now." /> : (
                <div className="grid md:grid-cols-2 gap-4">
                  {recommended.map((p) => <ProfileMiniCard key={p.id} p={p} savedSet={savedSet} sentSet={sentSet} onChanged={loadAll} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              {updateRequests.length === 0 ? <Empty msg="No update requests yet." /> : (
                <div className="space-y-3">
                  {updateRequests.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <span className="font-medium">{r.field_name}</span>
                          <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><span className="text-muted-foreground">Current:</span> {r.current_value || "—"}</div>
                          <div><span className="text-muted-foreground">Requested:</span> {r.requested_value}</div>
                          {r.reason && <div><span className="text-muted-foreground">Reason:</span> {r.reason}</div>}
                          {r.admin_notes && <div><span className="text-muted-foreground">Admin notes:</span> {r.admin_notes}</div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {!isPremium && (
              <TabsContent value="upgrade" className="mt-6">
                <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-purple-600" />Upgrade to Premium</CardTitle>
                    <CardDescription>Unlimited interests, contact details, biodata download & priority visibility.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
                      <li>✓ Unlimited interests (free plan: 5/month)</li>
                      <li>✓ View contact numbers & WhatsApp</li>
                      <li>✓ Full biodata access & PDF download</li>
                      <li>✓ Priority profile visibility</li>
                    </ul>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/pricing")}>
                      <Sparkles className="w-4 h-4 mr-2" />View Premium Plans
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>

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
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-center py-16 text-muted-foreground">{msg}</div>;
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
        <CardTitle className="flex items-center gap-2"><Edit3 className="w-5 h-5" /> Editable Fields</CardTitle>
        <CardDescription>Update these freely — changes save instantly without admin approval.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {EDITABLE_FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.long ? (
              <Textarea
                rows={3}
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            ) : (
              <Input
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <Button onClick={() => onSave(values)} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}