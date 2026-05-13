import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SetupProvider } from "./context/SetupContext";

export default function App() {
  return (
    <SetupProvider>
      <RouterProvider router={router} />
    </SetupProvider>
  );
}
