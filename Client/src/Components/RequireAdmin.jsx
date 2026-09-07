import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// עטיפה לנתיבי הניהול: מציגה את התוכן רק למשתמש מחובר עם role === "admin"
export default function RequireAdmin({ children }) {
  const { user, token, authInitialized } = useSelector((state) => state.auth);

  // עדיין משחזרים את המשתמש מהטוקן — לא מפנים כדי לא לזרוק מנהל אמיתי
  if (!authInitialized) {
    return null;
  }

  if (!token || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
