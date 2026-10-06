import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UpdateRequestsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-requests", { body: { action: "list" } });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setRequests(data.requests || []);
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    try {
      const { data, error } = await supabase.functions.invoke("admin-update-requests", {
        body: { action, request_id: id, admin_notes: notes[id] || null },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      toast({ title: `Request ${action}d` });
      await load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setActing(null); }
  };

  const isPaymentRequest = (r: any) => {
    const fn = (r.field_name || "").toUpperCase();
    return fn.includes("SINGLE_PROFILE_UNLOCK") || fn.includes("PREMIUM_UPGRADE") || fn.includes("48") || fn.includes("491");
  };

  const handleSendWhatsAppReply = (r: any) => {
    const rawPhone = r.profile?.whatsapp_number || "";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const memberName = r.profile?.name || "Member";
    const fn = (r.field_name || "").toUpperCase();
    const isSingle = fn.includes("SINGLE_PROFILE") || fn.includes("48");
    const isPayment = isPaymentRequest(r);
    const targetInfo = r.current_value || r.requested_value || "Selected Profile";

    let text = "";
    if (isPayment) {
      if (isSingle) {
        text = `Assalamu Alaikum ${memberName} 🌸,\n\nAapka ₹48 payment single profile unlock (${targetInfo}) ke liye verify ho gaya hai! Complete verified contact details aur photos unlock kar di gayi hain.\n\nJazakAllahu Khair 🤍`;
      } else {
        text = `Assalamu Alaikum ${memberName} 🌸,\n\nAapka Premium Plan (₹491) payment verify ho gaya hai! Aapki profile Premium upgrade kar di gayi hai.\n\nJazakAllahu Khair 🤍`;
      }
    } else {
      text = `Assalamu Alaikum ${memberName} 🌸,\n\nAapka profile update request (${r.field_name}) status: ${r.status?.toUpperCase()}.\n\nJazakAllahu Khair 🤍`;
    }

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!requests.length) return <div className="text-center py-10 text-muted-foreground">No profile update requests.</div>;

  return (
    <div className="space-y-4">
      {requests.map((r) => {
        const isPayment = isPaymentRequest(r);
        return (
          <Card key={r.id} className="border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg">
                  {r.profile?.name || `Profile #${r.profile_id}`} — <span className="text-primary font-bold">{r.field_name}</span>
                </CardTitle>
                <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                  {r.status}
                </Badge>
              </div>
              <CardDescription className="text-xs flex items-center gap-2 flex-wrap mt-1">
                <span>📧 {r.profile?.email || "No email"}</span>
                <span>•</span>
                <span>📱 {r.profile?.whatsapp_number || "No mobile"}</span>
                <span>•</span>
                <span>📅 {new Date(r.created_at).toLocaleString()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Target Profile / Current Value</p>
                  <p className="whitespace-pre-wrap font-medium">{r.current_value || "—"}</p>
                </div>
                <div className="rounded-xl border p-3 bg-primary/5">
                  <p className="text-xs font-semibold text-primary mb-1">Payment Details / Requested</p>
                  <p className="whitespace-pre-wrap font-medium">{r.requested_value}</p>
                </div>
              </div>
              {r.reason && <div className="text-xs bg-muted/50 p-2.5 rounded-lg"><span className="font-semibold text-foreground">Reason / Note:</span> {r.reason}</div>}
              {r.admin_notes && <div className="text-xs bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg text-emerald-800 dark:text-emerald-300"><span className="font-semibold">Admin Notes:</span> {r.admin_notes}</div>}
              
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {isPayment && r.profile?.whatsapp_number && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 border-emerald-600/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold text-xs rounded-lg gap-1.5 cursor-pointer"
                    onClick={() => handleSendWhatsAppReply(r)}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                    <span>Send Payment Confirmation on WhatsApp</span>
                  </Button>
                )}

                {r.status === "pending" && (
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button size="sm" onClick={() => act(r.id, "approve")} disabled={acting === r.id} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg gap-1 cursor-pointer">
                      {acting === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Approve & Apply
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => act(r.id, "reject")} disabled={acting === r.id} className="font-bold text-xs rounded-lg gap-1 cursor-pointer">
                      <X className="w-3.5 h-3.5" />Reject
                    </Button>
                  </div>
                )}
              </div>
              {r.status === "pending" && (
                <Textarea
                  placeholder="Optional Admin note..."
                  value={notes[r.id] || ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  rows={1}
                  className="text-xs mt-2"
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}