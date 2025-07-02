// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { logout } from "../store/actions/user";

const ProtectedRoute = ({ children }) => {
  const account = localStorage.getItem("account");
  const token = account ? JSON.parse(account).accessToken : null;
  const role = account ? JSON.parse(account).user.role : null;

  if (!token || role !== "admin") {
    logout();
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
