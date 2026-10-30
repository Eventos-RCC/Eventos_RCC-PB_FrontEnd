import { LandingPage } from "@/pages/LandingPage";
import { UserPage } from "@/pages/UserPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage";
import { AddressPage } from "@/pages/AddressPage";
import { GroupAndMinisteriosPage } from "@/pages/GroupAndMinisteriosPage";
import { RccFormationPage } from "@/pages/RccFormationPage";

export const defaultRoutes = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
        errorElement: <ErrorPage />
    },
    {
        path: "/signup",
        element: <RegisterPage />
    },
    {
        path: "/address",
        element: <AddressPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/groups-and-ministries",
        element: <GroupAndMinisteriosPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/rcc-formation",
        element: <RccFormationPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/user",
        element: <UserPage children />
    },
])