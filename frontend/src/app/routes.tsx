import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SetupPage } from "./pages/SetupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/verify-email",
    Component: VerifyEmailPage,
  },
  {
    path: "/setup",
    Component: () => (
      <ProtectedRoute>
        <SetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    Component: () => (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
