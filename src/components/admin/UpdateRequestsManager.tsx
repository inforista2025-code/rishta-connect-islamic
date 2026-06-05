import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X } from "lucide-react";
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

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!requests.length) return <div className="text-center py-10 text-muted-foreground">No profile update requests.</div>;

  return (
    <div className="space-y-4">
      {requests.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">
                {r.profile?.name || `Profile #${r.profile_id}`} — {r.field_name}
              </CardTitle>
              <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                {r.status}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {r.profile?.email} · {r.profile?.whatsapp_number} · {new Date(r.created_at).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded border p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="whitespace-pre-wrap">{r.current_value || "—"}</p>
              </div>
              <div className="rounded border p-3 bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">Requested</p>
                <p className="whitespace-pre-wrap">{r.requested_value}</p>
              </div>
            </div>
            {r.reason && <div className="text-sm"><span className="text-muted-foreground">Reason:</span> {r.reason}</div>}
            {r.admin_notes && <div className="text-sm"><span className="text-muted-foreground">Admin notes:</span> {r.admin_notes}</div>}
            {r.status === "pending" && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Optional admin notes"
                  value={notes[r.id] || ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button onClick={() => act(r.id, "approve")} disabled={acting === r.id}>
                    {acting === r.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                    Approve & Apply
                  </Button>
                  <Button variant="destructive" onClick={() => act(r.id, "reject")} disabled={acting === r.id}>
                    <X className="w-4 h-4 mr-1" />Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}