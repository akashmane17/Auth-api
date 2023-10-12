import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const user = useSelector((state: any) => state.reducer.user);

  return user && user.isVerified ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
