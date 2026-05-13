import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SetupPage } from "./pages/SetupPage";
import { DashboardPage } from "./pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/setup",
    Component: SetupPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
]);
