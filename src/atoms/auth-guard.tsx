import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};
