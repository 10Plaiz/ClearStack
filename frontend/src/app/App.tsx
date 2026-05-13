import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SetupProvider } from "./context/SetupContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SetupProvider>
        <RouterProvider router={router} />
      </SetupProvider>
    </AuthProvider>
  );
}
