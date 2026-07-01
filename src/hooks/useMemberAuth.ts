import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "member_session_token";

export interface Member {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number?: string;
  plan_type: "free" | "premium" | string;
  premium_expiry?: string | null;
  verification_status?: string;
  residence_location?: string;
  gender?: string;
  date_of_birth?: string;
}

export function getMemberToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setMemberToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearMemberToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function useMemberAuth() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async () => {
    const token = getMemberToken();
    if (!token) {
      setMember(null);
      setLoading(false);
      return;
    }
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("member-session-validate", {
        body: { session_token: token },
      });
      if (fnErr || !data?.valid) {
        const msg = data?.error || fnErr?.message || null;
        console.warn("[useMemberAuth] session invalid:", msg, { fnErr, data });
        clearMemberToken();
        setMember(null);
        setError(msg);
      } else {
        setMember(data.member);
        setError(null);
      }
    } catch (e: any) {
      setError(e.message);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validate();
    const id = setInterval(validate, 60_000);
    return () => clearInterval(id);
  }, [validate]);

  const logout = useCallback(async () => {
    const token = getMemberToken();
    if (token) {
      try {
        await supabase.functions.invoke("member-session-validate", {
          body: { session_token: token, action: "logout" },
        });
      } catch {}
    }
    clearMemberToken();
    setMember(null);
  }, []);

  return { member, loading, error, refresh: validate, logout };
}