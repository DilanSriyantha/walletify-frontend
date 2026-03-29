import { lazy } from "react";
import RouteLoader from "./RouteLoader";
import { type RouteObject } from "react-router";
import MainLayout from "../layouts/MainLayout";

// Lazy-loaded pages
const Dashboard = RouteLoader(lazy(() => import("../pages/Dashboard")));
const Logbooks = RouteLoader(lazy(() => import("../pages/Logbooks")));
const LogbookDetail = RouteLoader(lazy(() => import("../pages/LogbookDetail")));
const NotFound = RouteLoader(lazy(() => import("../pages/NotFound")));

const MainRoutes: RouteObject[] = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                // path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "logbooks",
                element: <Logbooks />,
            },
            {
                path: "logbooks/:id",
                element: <LogbookDetail />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

export default MainRoutes;
