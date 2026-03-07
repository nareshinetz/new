import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PermissionRoute = ({ children, moduleKey }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = user?.permissions?.[moduleKey];

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PermissionRoute;