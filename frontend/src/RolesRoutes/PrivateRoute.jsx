import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth(); 

    if (loading) {
        return <div>Loading...</div>;
    }


    console.log("User:", user);
    if (user) {
        console.log("User Role Lowercase:", user.role.toLowerCase());
    }
    console.log("Allowed Roles:", allowedRoles);
    console.log("Allowed Roles Lowercase:", allowedRoles.map(role => role.toLowerCase()));


    if (!user) {
        return <Navigate to="/login" />;
    }



    if (allowedRoles && !allowedRoles.map(role => role.toLowerCase()).includes(user.role.toLowerCase())) {
        console.log(`Role Mismatch: ${user.role} not in ${allowedRoles}`);
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;