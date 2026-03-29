import { lazy } from "react";
import RouteLoader from "./RouteLoader";
import { Navigate, RouteObject } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";

const SignIn = RouteLoader(lazy(() => import("../pages/SignIn")));
// const SignUp = RouteLoader(lazy(() => import("../pages/SignUp")));

const AuthRoutes: RouteObject[] = [
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <SignIn />
            },
            // {
            //     path: "signup",
            //     element: <SignUp />
            // },
            {
                path: "*",
                element: <Navigate to="/" replace />
            }
        ]
    }
];

export default AuthRoutes;