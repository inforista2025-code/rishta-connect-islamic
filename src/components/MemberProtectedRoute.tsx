import { Navigate } from "react-router-dom";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { Loader2 } from "lucide-react";

export function MemberProtectedRoute({ children }: { children: React.ReactNode }) {
  const { member, loading } = useMemberAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!member) return <Navigate to="/member/login" replace />;
  return <>{children}</>;
}