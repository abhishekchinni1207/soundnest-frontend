import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminRoute({ children }) {
  const { role, loading } = useAuth();

  // ⏳ While auth is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm opacity-60">
        Checking permissions…
      </div>
    );
  }

  // 🚫 Not admin → redirect home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
}
