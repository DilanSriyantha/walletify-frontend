import { useAuth } from "@/context/AuthContext";
import AuthRoutes from "./AuthRoutes"
import { useRoutes } from "react-router-dom";
import MainRoutes from "./MainRoutes";

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return user
        ? useRoutes(MainRoutes)
        : useRoutes(AuthRoutes);
}

export default AppRoutes;