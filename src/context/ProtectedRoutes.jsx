import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { useLocation } from "react-router-dom";

const ProtectedRoutesUser = () => {
  const { user } = useUser(); 
  const location = useLocation();
  console.log("User in ProtectedRoutesUser:", user); // Debugging line
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} />;
};

export default ProtectedRoutesUser;