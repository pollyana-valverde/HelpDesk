import { useState, useEffect, createContext, type ReactNode } from "react";
import { api } from "../services/api";

interface AuthContextType {
  isLoading: boolean;
  session: null | UserAPIResponse;
  login: (data: UserAPIResponse) => void;
  logout: () => void;
}

const LOCAL_STORAGE_KEY = "@helpdesk";

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<null | UserAPIResponse>(null);

  function login(data: UserAPIResponse) {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}:token`,
      JSON.stringify(data.token)
    );
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}:user`,
      JSON.stringify(data.user)
    );

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setSession(data);
  }

  function logout() {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);

    setSession(null);
    setIsLoading(false);

    window.location.assign("/");
  }

  function loadUser() {
    const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`);
    const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);

    if (token && user) {
      const parsedToken = JSON.parse(token);
      const parsedUser = JSON.parse(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;

      setSession({
        token: parsedToken,
        user: parsedUser,
      });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
