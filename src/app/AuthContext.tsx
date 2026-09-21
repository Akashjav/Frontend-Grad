import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getMe, revokeSession } from "../lib/authApi";
import { getToken, removeToken } from "../lib/api";
import type { CurrentUser } from "../lib/currentUser";

type AuthState = {
  user: CurrentUser | null;
  loading: boolean;
  error: string;
  refreshUser: () => Promise<CurrentUser>;
  updateProfile: (profile: NonNullable<CurrentUser["profile"]>) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const signOut = useCallback(() => {
    requestId.current += 1;
    const token = getToken();
    if (token && localStorage.getItem("auth_api") === "v1") void revokeSession(token).catch(console.error);
    removeToken();
    setUser(null);
    setError("");
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const id = ++requestId.current;
    const token = getToken();
    const me: CurrentUser = await getMe();
    if (id !== requestId.current || token !== getToken()) {
      throw new Error("Your session changed. Please sign in again.");
    }
    setUser(me);
    setError("");
    return me;
  }, []);

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) return;
      setUser(null);
      setLoading(true);
      try {
        await refreshUser();
      } catch (err) {
        if (getToken()) setError(err instanceof Error ? err.message : "Unable to load your account.");
      } finally {
        setLoading(false);
      }
    }
    void restoreSession();
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "access_token" && event.key !== null) return;
      requestId.current += 1;
      setUser(null);
      setError("");
      if (getToken()) void restoreSession();
      else setLoading(false);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:expired", signOut);
    return () => {
      requestId.current += 1;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:expired", signOut);
    };
  }, [refreshUser, signOut]);

  function updateProfile(profile: NonNullable<CurrentUser["profile"]>) {
    setUser(current => current && current.id === user?.id && current.email === user?.email
      ? { ...current, profile: { ...current.profile, ...profile } } : current);
  }

  return <AuthContext.Provider value={{ user, loading, error, refreshUser, updateProfile, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
