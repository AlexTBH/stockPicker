import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "Admin" | "User";
}) {
  const token = useSelector(
    (state: RootState) => state.auth.token
  );

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/portfolio" replace />;
  }

  return children;
}