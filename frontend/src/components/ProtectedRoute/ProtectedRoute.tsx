import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps extends React.PropsWithChildren{
  isaAllowed: boolean | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({isaAllowed, children}) => {
  if(!isaAllowed) {
    return <Navigate to="/login"/>;
  }

  return children as React.ReactElement;
};

export default ProtectedRoute;