import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoutesUser = () => {
  const { user } = useUser(); // Get the user state from context
  console.log("User in ProtectedRoutesUser:", user); // Debugging line
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutesUser;