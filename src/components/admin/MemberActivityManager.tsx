import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Search, Users, Wifi, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberActivity {
  id: number;
  name: string;
  email: string | null;
  whatsapp_number: string | null;
  gender: string | null;
  plan_type: string;
  verification_status: string;
  login_count: number;
  last_login_at: string | null;
  last_active_at: string | null;
  session_active: boolean;
  online: boolean;
  otp_requests_30d?: number;
  failed_logins_30d?: number;
  last_otp_at?: string | null;
  last_login_issue?: string | null;
  last_otp_status?: string | null;
}

interface LoginAttempt {
  id: string;
  name: string;
  email: string | null;
  whatsapp_number: string | null;
  created_at: string;
  attempts: number;
  status: string;
  label: string;
}

const fmt = (v: string | null) =>
  v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

export function MemberActivityManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberActivity[]>([]);
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [failedCount, setFailedCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalLogins, setTotalLogins] = useState(0);
  const [search, setSearch] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-member-activity", { body: {} });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setMembers(data.members || []);
      setAttempts(data.attempts || []);
      setFailedCount(data.failed_attempts_count || 0);
      setOnlineCount(data.online_count || 0);
      setTotalLogins(data.total_logins || 0);
    } catch (e: any) {
      if (!silent) toast({ title: "Failed to load activity", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), 30_000);
    return () => clearInterval(id);
  }, []);

  const filtered = members.filter((m) => {
    if (onlyOnline && !m.online) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [m.name, m.email, m.whatsapp_number].some((v) => (v || "").toLowerCase().includes(q));
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Wifi className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">Online now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{members.filter((m) => m.login_count > 0).length}</p>
              <p className="text-xs text-muted-foreground">Members who logged in</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalLogins}</p>
              <p className="text-xs text-muted-foreground">Total logins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-2xl font-bold">{failedCount}</p>
              <p className="text-xs text-muted-foreground">Incomplete logins (30d)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, email or WhatsApp"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant={onlyOnline ? "default" : "outline"} onClick={() => setOnlyOnline((v) => !v)}>
          Online only
        </Button>
        <Button variant="outline" onClick={() => load()}>
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No members found.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        m.online ? "bg-green-500 animate-pulse" : "bg-muted-foreground/40"
                      }`}
                    />
                    <p className="font-semibold">{m.name}</p>
                    <Badge variant={m.online ? "default" : "secondary"} className={m.online ? "bg-green-600 hover:bg-green-600" : ""}>
                      {m.online ? "Online" : m.session_active ? "Logged in" : "Offline"}
                    </Badge>
                    {m.plan_type === "premium" && <Badge variant="outline">Premium</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {m.email || "no email"} · {m.whatsapp_number || "—"}
                  </p>
                  {m.last_login_issue && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {m.last_login_issue}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Last login: {fmt(m.last_login_at)}</p>
                  <p>Last active: {fmt(m.last_active_at)}</p>
                  <p>OTP sent (30d): {m.otp_requests_30d ?? 0} · Not completed: {m.failed_logins_30d ?? 0}</p>
                </div>
                <div className="text-center min-w-[90px]">
                  <p className="text-xl font-bold text-primary">{m.login_count}</p>
                  <p className="text-[11px] text-muted-foreground">Total logins</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Recent login attempts (last 30 days)
          </h3>
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No login attempts recorded.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {attempts.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 border rounded-md p-3"
                >
                  <div className="min-w-[180px]">
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.email || "no email"} · {a.whatsapp_number || "—"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{fmt(a.created_at)}</p>
                  <Badge
                    variant={a.status === "success" ? "default" : "secondary"}
                    className={
                      a.status === "success"
                        ? "bg-green-600 hover:bg-green-600"
                        : a.status === "pending"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/10"
                    }
                  >
                    {a.label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}