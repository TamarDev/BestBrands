import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Wrapper for admin routes: render content only for an authenticated admin.
export default function RequireAdmin({ children }) {
  const { user, token, authInitialized } = useSelector((state) => state.auth);

  // Restore the user from the token before redirecting, so valid admins are not rejected.
  if (!authInitialized) {
    return null;
  }

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
