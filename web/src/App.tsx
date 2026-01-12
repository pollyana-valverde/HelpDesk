import { AuthProvider } from "./contexts/Auth.context";
import { Routes } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}