import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionExpired = searchParams.get("session") === "expired";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
