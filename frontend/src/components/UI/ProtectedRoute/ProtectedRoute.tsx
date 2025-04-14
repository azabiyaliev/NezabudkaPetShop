import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps extends React.PropsWithChildren {
  isAllowed: boolean | null;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  children,
  redirectTo = "/login",
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  return children as React.ReactElement;
};

export default ProtectedRoute;
