import { api, API_URL, getToken, setToken, removeToken, formatApiError } from "./api";

export async function login(email: string, password: string, role = "student") {
  if (["student", "alumni", "admin", "super_admin", "industry", "academician", "institution_admin"].includes(role)) {
    const res = await fetch(`${API_URL}/api/v1/auth/signin`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(formatApiError(data, res.status));
    setToken(data.access_token, "v1");
    if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
    return data;
  }
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(formatApiError(data, res.status));
  }

  setToken(data.access_token);
  return data;
}

export async function getMe() {
  const token = getToken();
  if (localStorage.getItem("auth_api") === "v1") {
    const me = await api.get("/api/v1/auth/me");
    const legacy = await api.get("/api/me");
    return { ...legacy, ...me, profile: { ...legacy.profile, ...me.profile, display_name: me.display_name } };
  }
  const legacy = await api.get("/api/me");
  if (legacy.role === "industry") {
    const me = await api.get("/api/v1/auth/me");
    if (token === getToken()) localStorage.setItem("auth_api", "v1");
    return { ...me, profile: { ...me.profile, display_name: me.display_name } };
  }
  return legacy;
}

export async function revokeSession(token: string) {
  await fetch(`${API_URL}/api/v1/auth/signout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
}

export async function renewSession() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("Sign in again to renew this session.");
  const currentToken = getToken();
  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: refreshToken }) });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(formatApiError(data, response.status));
  if (currentToken !== getToken()) throw new Error("Your account changed. Please sign in again.");
  setToken(data.access_token, "v1");
  localStorage.setItem("refresh_token", data.refresh_token);
}

export const verifyEmail = (email: string, code: string) => api.post("/api/v1/auth/verify-otp", { email, code });
export const resendVerification = (email: string) => api.post("/api/v1/auth/resend-otp", { email });
export const requestPasswordReset = (email: string) => api.post("/api/v1/auth/forgot-password", { email });
export const resetPassword = (email: string, code: string, password: string) => api.post("/api/v1/auth/reset-password", { email, code, password });

export async function logout() {
  removeToken();
}

export async function studentSignup(data: any) {
  const res = await api.post("/api/auth/signup/student", data);
  setToken(res.access_token);
  return res;
}

export async function alumniSignup(data: any) {
  const res = await api.post("/api/auth/signup/alumni", data);
  setToken(res.access_token);
  return res;
}
