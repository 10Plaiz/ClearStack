import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
        <p className="text-[#75758a]" style={{ fontSize: "14px" }}>
          Checking your session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  return children;
}

