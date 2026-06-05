import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMemberToken } from "./useMemberAuth";

export function useMemberApi() {
  const call = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const session_token = getMemberToken();
    const { data, error } = await supabase.functions.invoke("member-dashboard", {
      body: { session_token, action, ...payload },
    });
    if (error) throw new Error(error.message);
    if (data?.error && data.error !== "limit_reached") throw new Error(data.message || data.error);
    return data;
  }, []);
  return { call };
}